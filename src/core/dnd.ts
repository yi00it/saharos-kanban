/**
 * Saharos Kanban - Drag & Drop Engine
 * Pointer-based drag and drop implementation
 */

import type { Card, Column, ID, DragOptions } from './types';
import { EventBus } from './events';

interface DragState {
  isDragging: boolean;
  draggedCard: Card | null;
  draggedElement: HTMLElement | null;
  mirrorElement: HTMLElement | null;
  sourceColumn: Column | null;
  targetColumn: Column | null;
  placeholder: HTMLElement | null;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
  currentX: number;
  currentY: number;
}

interface DropTarget {
  column: Column;
  columnElement: HTMLElement;
  insertIndex: number;
  insertBefore: HTMLElement | null;
}

/**
 * DragAndDropManager - Handles all drag and drop operations
 */
export class DragAndDropManager {
  private container: HTMLElement;
  private eventBus: EventBus;
  private options: DragOptions;
  private state: DragState;
  private readonly: boolean;
  private draggable: boolean;
  private getCardDataCallback: ((cardId: ID) => Card | null) | null = null;
  private getColumnDataCallback: ((columnId: ID) => Column | null) | null = null;

  private boundHandlePointerDown: (e: PointerEvent) => void;
  private boundHandlePointerMove: (e: PointerEvent) => void;
  private boundHandlePointerUp: (e: PointerEvent) => void;
  private boundHandlePointerCancel: (e: PointerEvent) => void;

  constructor(
    container: HTMLElement,
    eventBus: EventBus,
    options: DragOptions = {},
    readonly: boolean = false,
    draggable: boolean = true
  ) {
    this.container = container;
    this.eventBus = eventBus;
    this.readonly = readonly;
    this.draggable = draggable;

    this.options = {
      handleSelector: options.handleSelector ?? null,
      mirrorClass: options.mirrorClass ?? 'sk-card--mirror',
      hoverClassColumn: options.hoverClassColumn ?? 'sk-column--drag-over',
      hoverClassCardPlaceholder: options.hoverClassCardPlaceholder ?? 'sk-card-placeholder',
      pointerTolerance: options.pointerTolerance ?? 5,
    };

    this.state = this.getInitialState();

    // Bind event handlers
    this.boundHandlePointerDown = this.handlePointerDown.bind(this);
    this.boundHandlePointerMove = this.handlePointerMove.bind(this);
    this.boundHandlePointerUp = this.handlePointerUp.bind(this);
    this.boundHandlePointerCancel = this.handlePointerCancel.bind(this);

    this.attachEventListeners();
  }

  /**
   * Get initial drag state
   */
  private getInitialState(): DragState {
    return {
      isDragging: false,
      draggedCard: null,
      draggedElement: null,
      mirrorElement: null,
      sourceColumn: null,
      targetColumn: null,
      placeholder: null,
      startX: 0,
      startY: 0,
      offsetX: 0,
      offsetY: 0,
      currentX: 0,
      currentY: 0,
    };
  }

  /**
   * Attach pointer event listeners
   */
  private attachEventListeners(): void {
    if (this.readonly || !this.draggable) return;

    this.container.addEventListener('pointerdown', this.boundHandlePointerDown);
  }

  /**
   * Remove pointer event listeners
   */
  private detachEventListeners(): void {
    this.container.removeEventListener('pointerdown', this.boundHandlePointerDown);
    document.removeEventListener('pointermove', this.boundHandlePointerMove);
    document.removeEventListener('pointerup', this.boundHandlePointerUp);
    document.removeEventListener('pointercancel', this.boundHandlePointerCancel);
  }

  /**
   * Handle pointer down event
   */
  private handlePointerDown(e: PointerEvent): void {
    // Check if target is a card
    const cardElement = this.findCardElement(e.target as HTMLElement);
    if (!cardElement) return;

    // Check if drag handle is required
    if (this.options.handleSelector) {
      const handle = (e.target as HTMLElement).closest(this.options.handleSelector);
      if (!handle || !cardElement.contains(handle as Node)) return;
    }

    // Prevent default to avoid text selection
    e.preventDefault();

    // Get card data
    const cardIdRaw = cardElement.dataset.cardId;
    if (!cardIdRaw) return;

    // Convert to number if it's a numeric string, otherwise keep as string
    const cardId: ID = /^\d+$/.test(cardIdRaw) ? Number(cardIdRaw) : cardIdRaw;

    const card = this.getCardData(cardId);
    const column = this.getColumnData(card?.columnId);
    if (!card || !column) return;

    // Store initial state
    const rect = cardElement.getBoundingClientRect();
    this.state = {
      isDragging: false, // Will be true after tolerance
      draggedCard: card,
      draggedElement: cardElement,
      mirrorElement: null,
      sourceColumn: column,
      targetColumn: column,
      placeholder: null,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      currentX: e.clientX,
      currentY: e.clientY,
    };

    // Add global listeners
    document.addEventListener('pointermove', this.boundHandlePointerMove);
    document.addEventListener('pointerup', this.boundHandlePointerUp);
    document.addEventListener('pointercancel', this.boundHandlePointerCancel);
  }

  /**
   * Handle pointer move event
   */
  private handlePointerMove(e: PointerEvent): void {
    if (!this.state.draggedCard || !this.state.draggedElement) return;

    this.state.currentX = e.clientX;
    this.state.currentY = e.clientY;

    // Check if we've moved beyond tolerance
    const dx = Math.abs(e.clientX - this.state.startX);
    const dy = Math.abs(e.clientY - this.state.startY);
    const tolerance = this.options.pointerTolerance ?? 5;

    if (!this.state.isDragging && (dx > tolerance || dy > tolerance)) {
      this.startDrag();
    }

    if (this.state.isDragging) {
      this.updateDrag(e.clientX, e.clientY);
    }
  }

  /**
   * Handle pointer up event
   */
  private handlePointerUp(): void {
    if (this.state.isDragging) {
      this.endDrag(false);
    } else {
      this.cancelDrag();
    }
  }

  /**
   * Handle pointer cancel event
   */
  private handlePointerCancel(): void {
    if (this.state.isDragging) {
      this.cancelDrag();
    }
  }

  /**
   * Start dragging
   */
  private startDrag(): void {
    if (!this.state.draggedCard || !this.state.draggedElement) return;

    this.state.isDragging = true;

    // Create mirror element
    this.createMirror();

    // Create placeholder
    this.createPlaceholder();

    // Add dragging class to original element
    this.state.draggedElement.classList.add('sk-card--dragging');

    // Emit drag start event
    this.eventBus.emit('card:drag:start', {
      card: this.state.draggedCard,
      event: new PointerEvent('pointerdown'),
    });
  }

  /**
   * Update drag position and target
   */
  private updateDrag(x: number, y: number): void {
    if (!this.state.mirrorElement) return;

    // Update mirror position
    this.state.mirrorElement.style.left = `${x - this.state.offsetX}px`;
    this.state.mirrorElement.style.top = `${y - this.state.offsetY}px`;

    // Find drop target
    const dropTarget = this.findDropTarget(x, y);
    
    if (dropTarget) {
      this.updateDropTarget(dropTarget);
      
      // Emit drag over event
      if (this.state.draggedCard && this.state.targetColumn) {
        this.eventBus.emit('card:drag:over', {
          card: this.state.draggedCard,
          column: this.state.targetColumn,
        });
      }
    }
  }

  /**
   * End drag and commit changes
   */
  private endDrag(cancelled: boolean): void {
    if (!this.state.draggedCard || !this.state.sourceColumn) {
      this.cleanup();
      return;
    }

    if (cancelled) {
      this.eventBus.emit('card:drag:cancel', {
        card: this.state.draggedCard,
      });
    } else {
      // Emit drag end event with source and target columns
      this.eventBus.emit('card:drag:end', {
        card: this.state.draggedCard,
        from: this.state.sourceColumn,
        to: this.state.targetColumn ?? this.state.sourceColumn,
      });
    }

    this.cleanup();
  }

  /**
   * Cancel drag
   */
  private cancelDrag(): void {
    this.endDrag(true);
  }

  /**
   * Create mirror element
   */
  private createMirror(): void {
    if (!this.state.draggedElement) return;

    const mirror = this.state.draggedElement.cloneNode(true) as HTMLElement;
    mirror.classList.add(this.options.mirrorClass ?? 'sk-card--mirror');
    mirror.style.position = 'fixed';
    mirror.style.left = `${this.state.currentX - this.state.offsetX}px`;
    mirror.style.top = `${this.state.currentY - this.state.offsetY}px`;
    mirror.style.width = `${this.state.draggedElement.offsetWidth}px`;
    mirror.style.pointerEvents = 'none';
    mirror.style.zIndex = '1000';

    document.body.appendChild(mirror);
    this.state.mirrorElement = mirror;
  }

  /**
   * Create placeholder element
   */
  private createPlaceholder(): void {
    if (!this.state.draggedElement) return;

    const placeholder = document.createElement('div');
    placeholder.className = this.options.hoverClassCardPlaceholder ?? 'sk-card-placeholder';
    placeholder.style.height = `${this.state.draggedElement.offsetHeight}px`;

    this.state.placeholder = placeholder;
  }

  /**
   * Find drop target at coordinates
   */
  private findDropTarget(x: number, y: number): DropTarget | null {
    // Hide mirror temporarily to get element underneath
    if (this.state.mirrorElement) {
      this.state.mirrorElement.style.display = 'none';
    }

    const elementAtPoint = document.elementFromPoint(x, y);

    if (this.state.mirrorElement) {
      this.state.mirrorElement.style.display = '';
    }

    if (!elementAtPoint) return null;

    // Find column
    const columnElement = this.findColumnElement(elementAtPoint as HTMLElement);
    if (!columnElement) return null;

    const columnIdRaw = columnElement.dataset.columnId;
    if (!columnIdRaw) return null;

    // Convert to number if it's a numeric string, otherwise keep as string
    const columnId: ID = /^\d+$/.test(columnIdRaw) ? Number(columnIdRaw) : columnIdRaw;

    const column = this.getColumnData(columnId);
    if (!column) return null;

    // Find cards container
    const cardsContainer = columnElement.querySelector('.sk-cards');
    if (!cardsContainer) return null;

    // Find insertion point
    const cards = Array.from(cardsContainer.querySelectorAll('.sk-card:not(.sk-card--dragging)'));
    let insertIndex = cards.length;
    let insertBefore: HTMLElement | null = null;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      const rect = card.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;

      if (y < midY) {
        insertIndex = i;
        insertBefore = card;
        break;
      }
    }

    return {
      column,
      columnElement,
      insertIndex,
      insertBefore,
    };
  }

  /**
   * Update drop target with placeholder
   */
  private updateDropTarget(target: DropTarget): void {
    if (!this.state.placeholder) return;

    this.state.targetColumn = target.column;

    // Remove old hover classes
    const oldHoverColumns = this.container.querySelectorAll(`.${this.options.hoverClassColumn}`);
    oldHoverColumns.forEach((el) => el.classList.remove(this.options.hoverClassColumn ?? ''));

    // Add hover class to new column
    target.columnElement.classList.add(this.options.hoverClassColumn ?? 'sk-column--drag-over');

    // Move placeholder
    const cardsContainer = target.columnElement.querySelector('.sk-cards');
    if (!cardsContainer) return;

    // Remove placeholder from old location
    if (this.state.placeholder.parentElement) {
      this.state.placeholder.remove();
    }

    // Insert placeholder at new location
    if (target.insertBefore) {
      cardsContainer.insertBefore(this.state.placeholder, target.insertBefore);
    } else {
      cardsContainer.appendChild(this.state.placeholder);
    }
  }

  /**
   * Cleanup after drag
   */
  private cleanup(): void {
    // Remove mirror
    if (this.state.mirrorElement) {
      this.state.mirrorElement.remove();
    }

    // Remove placeholder
    if (this.state.placeholder) {
      this.state.placeholder.remove();
    }

    // Remove dragging class
    if (this.state.draggedElement) {
      this.state.draggedElement.classList.remove('sk-card--dragging');
    }

    // Remove hover classes
    const hoverColumns = this.container.querySelectorAll(`.${this.options.hoverClassColumn}`);
    hoverColumns.forEach((el) => el.classList.remove(this.options.hoverClassColumn ?? ''));

    // Remove global listeners
    document.removeEventListener('pointermove', this.boundHandlePointerMove);
    document.removeEventListener('pointerup', this.boundHandlePointerUp);
    document.removeEventListener('pointercancel', this.boundHandlePointerCancel);

    // Reset state
    this.state = this.getInitialState();
  }

  /**
   * Find card element from target
   */
  private findCardElement(target: HTMLElement): HTMLElement | null {
    return target.closest('.sk-card');
  }

  /**
   * Find column element from target
   */
  private findColumnElement(target: HTMLElement): HTMLElement | null {
    return target.closest('.sk-column');
  }

  /**
   * Get card data - uses callback if provided, otherwise returns mock
   */
  private getCardData(cardId: ID): Card | null {
    if (this.getCardDataCallback) {
      return this.getCardDataCallback(cardId);
    }
    // Fallback mock data
    return {
      id: cardId,
      title: '',
      columnId: '',
    };
  }

  /**
   * Get column data - uses callback if provided, otherwise returns mock
   */
  private getColumnData(columnId?: ID): Column | null {
    if (!columnId) return null;
    if (this.getColumnDataCallback) {
      return this.getColumnDataCallback(columnId);
    }
    // Fallback mock data
    return {
      id: columnId,
      title: '',
    };
  }

  /**
   * Set callback for getting card data
   */
  setCardDataGetter(callback: (cardId: ID) => Card | null): void {
    this.getCardDataCallback = callback;
  }

  /**
   * Set callback for getting column data
   */
  setColumnDataGetter(callback: (columnId: ID) => Column | null): void {
    this.getColumnDataCallback = callback;
  }

  /**
   * Destroy and cleanup
   */
  destroy(): void {
    this.detachEventListeners();
    this.cleanup();
  }

  /**
   * Update options
   */
  updateOptions(options: Partial<DragOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Enable/disable dragging
   */
  setDraggable(draggable: boolean): void {
    if (this.draggable === draggable) return;
    
    this.draggable = draggable;
    
    if (draggable && !this.readonly) {
      this.attachEventListeners();
    } else {
      this.detachEventListeners();
    }
  }

  /**
   * Set readonly mode
   */
  setReadonly(readonly: boolean): void {
    if (this.readonly === readonly) return;
    
    this.readonly = readonly;
    
    if (readonly) {
      this.detachEventListeners();
    } else if (this.draggable) {
      this.attachEventListeners();
    }
  }
}
