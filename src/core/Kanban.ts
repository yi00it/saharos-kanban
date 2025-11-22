/**
 * Saharos Kanban - Main Class
 * The primary entry point for the Kanban board
 */

import type { SaharosKanbanOptions, KanbanState, ID, Card, Column, Lane } from './types';
import { EventBus } from './events';
import { StateManager } from './state';
import { DragAndDropManager } from './dnd';
import { StorageManager } from './storage';
import { AccessibilityManager } from '../dom/a11y';
import { renderBoard } from '../dom/render';

/**
 * SaharosKanban - Main class
 * Framework-agnostic, zero-dependency Kanban board
 */
export class SaharosKanban {
  private container: HTMLElement;
  private options: SaharosKanbanOptions;
  private eventBus: EventBus;
  private stateManager: StateManager;
  private dndManager: DragAndDropManager | null;
  private storageManager: StorageManager | null;
  private a11yManager: AccessibilityManager | null;
  private destroyed: boolean;

  constructor(containerOrSelector: string | HTMLElement, options: SaharosKanbanOptions = {}) {
    // Get container element
    if (typeof containerOrSelector === 'string') {
      const el = document.querySelector(containerOrSelector);
      if (!el) {
        throw new Error(`Container not found: ${containerOrSelector}`);
      }
      this.container = el as HTMLElement;
    } else {
      this.container = containerOrSelector;
    }

    // Set default options
    this.options = {
      id: options.id ?? 'saharos-kanban',
      storageKey: options.storageKey ?? null,
      readonly: options.readonly ?? false,
      draggable: options.draggable ?? true,
      sortable: options.sortable ?? true,
      columnWidth: options.columnWidth ?? 300,
      columnMinWidth: options.columnMinWidth ?? 200,
      columnMaxWidth: options.columnMaxWidth ?? 400,
      debug: options.debug ?? false,
      ...options,
    };

    // Initialize event bus
    this.eventBus = new EventBus(this.options.debug);

    // Register event handlers from options
    if (this.options.on) {
      Object.entries(this.options.on).forEach(([event, handler]) => {
        if (handler) {
          this.eventBus.on(event as never, handler as never);
        }
      });
    }

    // Initialize storage if enabled
    this.storageManager = null;
    if (this.options.storageKey && StorageManager.isAvailable()) {
      this.storageManager = new StorageManager(this.options.storageKey);
    }

    // Initialize state - try loading from storage first
    let initialState: KanbanState;
    if (this.storageManager) {
      const savedState = this.storageManager.load();
      initialState = savedState ?? {
        lanes: this.options.lanes ?? [],
        columns: this.options.columns ?? [],
        cards: this.options.cards ?? [],
      };
    } else {
      initialState = this.options.initialState ?? {
        lanes: this.options.lanes ?? [],
        columns: this.options.columns ?? [],
        cards: this.options.cards ?? [],
      };
    }

    this.stateManager = new StateManager(initialState);
    this.destroyed = false;
    this.dndManager = null;
    this.a11yManager = null;

    // Initial render
    this.render();

    // Initialize drag and drop
    this.initializeDragAndDrop();

    // Initialize accessibility
    this.initializeAccessibility();

    // Initialize plugins
    if (this.options.plugins) {
      this.options.plugins.forEach((plugin) => this.use(plugin));
    }

    // Emit ready event
    this.eventBus.emit('board:ready');
  }

  /**
   * Get current state
   */
  getState(): KanbanState {
    return this.stateManager.getState();
  }

  /**
   * Load a new state
   */
  loadState(state: KanbanState, opts?: { silent?: boolean }): void {
    this.stateManager.setState(state);
    this.render();

    if (!opts?.silent) {
      this.eventBus.emit('state:change', { state: this.getState() });
    }
  }

  /**
   * Refresh the board (re-render)
   */
  refresh(): void {
    this.render();
  }

  /**
   * Register an event handler
   */
  on<K extends keyof import('./types').SaharosEventHandlers>(
    event: K,
    handler: import('./types').SaharosEventHandlers[K]
  ): void {
    this.eventBus.on(event, handler as never);
  }

  /**
   * Unregister an event handler
   */
  off<K extends keyof import('./types').SaharosEventHandlers>(
    event: K,
    handler: import('./types').SaharosEventHandlers[K]
  ): void {
    this.eventBus.off(event, handler as never);
  }

  /**
   * Register a one-time event handler
   */
  once<K extends keyof import('./types').SaharosEventHandlers>(
    event: K,
    handler: import('./types').SaharosEventHandlers[K]
  ): void {
    this.eventBus.once(event, handler as never);
  }

  /**
   * Emit an event (internal use)
   */
  private emit<K extends keyof import('./types').SaharosEventHandlers>(
    event: K,
    data?: Parameters<import('./types').SaharosEventHandlers[K]>[0]
  ): void {
    this.eventBus.emit(event, data);
  }

  /**
   * Use a plugin
   */
  use(plugin: import('./types').SaharosKanbanPlugin): void {
    const context = {
      board: this,
      getState: () => this.getState(),
      setState: (state: KanbanState, opts?: { silent?: boolean }) => this.loadState(state, opts),
      on: this.on.bind(this),
      off: this.off.bind(this),
      emit: this.emit.bind(this),
      options: this.options,
    };
    plugin(context);
  }

  /**
   * Update options
   */
  setOptions(patch: Partial<SaharosKanbanOptions>): void {
    this.options = { ...this.options, ...patch };
    this.render();
  }

  // ==================== Card CRUD Methods ====================

  /**
   * Add a new card
   */
  addCard(card: Omit<Card, 'order'>, opts?: import('./types').AddItemOptions): Card {
    const newCard = this.stateManager.addCard(card as Card, opts?.index);
    this.render();
    this.eventBus.emit('card:add', { card: newCard });
    this.eventBus.emit('state:change', { state: this.getState() });
    return newCard;
  }

  /**
   * Update an existing card
   */
  updateCard(cardId: ID, patch: Partial<Card>): Card | null {
    const updatedCard = this.stateManager.updateCard(cardId, patch);
    if (updatedCard) {
      this.render();
      this.eventBus.emit('card:update', { card: updatedCard });
      this.eventBus.emit('state:change', { state: this.getState() });
    }
    return updatedCard;
  }

  /**
   * Remove a card
   */
  removeCard(cardId: ID): boolean {
    const success = this.stateManager.removeCard(cardId);
    if (success) {
      this.render();
      this.eventBus.emit('card:remove', { cardId });
      this.eventBus.emit('state:change', { state: this.getState() });
    }
    return success;
  }

  /**
   * Move a card to a new column/lane/position
   */
  moveCard(
    cardId: ID,
    to: { columnId: ID; laneId?: ID | null; index?: number },
    opts?: import('./types').MoveCardOptions
  ): boolean {
    const card = this.stateManager.getCard(cardId);
    if (!card) return false;

    const fromColumn = this.stateManager.getColumn(card.columnId);
    const toColumn = this.stateManager.getColumn(to.columnId);
    if (!toColumn) return false;

    const success = this.stateManager.moveCard(cardId, to.columnId, to.laneId, to.index);
    if (success) {
      this.render();
      
      // Only emit drag event if caused by API call (not pointer/keyboard)
      if (!opts?.cause || opts.cause === 'api') {
        this.eventBus.emit('card:drag:end', {
          card: this.stateManager.getCard(cardId)!,
          from: fromColumn!,
          to: toColumn,
        });
      }
      
      this.eventBus.emit('state:change', { state: this.getState() });
    }
    return success;
  }

  /**
   * Scroll to a specific card
   */
  scrollToCard(cardId: ID, opts?: ScrollIntoViewOptions): void {
    const cardElement = this.container.querySelector(`[data-card-id="${cardId}"]`);
    if (cardElement) {
      cardElement.scrollIntoView(opts ?? { behavior: 'smooth', block: 'center' });
      this.eventBus.emit('a11y:focus:card', { card: this.stateManager.getCard(cardId)! });
    }
  }

  // ==================== Column CRUD Methods ====================

  /**
   * Add a new column
   */
  addColumn(column: Column, opts?: import('./types').AddItemOptions): Column {
    const newColumn = this.stateManager.addColumn(column, opts?.index);
    this.render();
    this.eventBus.emit('column:add', { column: newColumn });
    this.eventBus.emit('state:change', { state: this.getState() });
    return newColumn;
  }

  /**
   * Update an existing column
   */
  updateColumn(columnId: ID, patch: Partial<Column>): Column | null {
    const updatedColumn = this.stateManager.updateColumn(columnId, patch);
    if (updatedColumn) {
      this.render();
      this.eventBus.emit('column:update', { column: updatedColumn });
      this.eventBus.emit('state:change', { state: this.getState() });
    }
    return updatedColumn;
  }

  /**
   * Remove a column
   */
  removeColumn(columnId: ID): boolean {
    const success = this.stateManager.removeColumn(columnId);
    if (success) {
      this.render();
      this.eventBus.emit('column:remove', { columnId });
      this.eventBus.emit('state:change', { state: this.getState() });
    }
    return success;
  }

  /**
   * Move a column to a new position
   */
  moveColumn(columnId: ID, toIndex: number): boolean {
    const column = this.stateManager.getColumn(columnId);
    if (!column) return false;

    // Update column order
    const updatedColumn = this.stateManager.updateColumn(columnId, { order: toIndex });
    if (updatedColumn) {
      this.render();
      this.eventBus.emit('column:move', { column: updatedColumn, toIndex });
      this.eventBus.emit('state:change', { state: this.getState() });
      return true;
    }
    return false;
  }

  // ==================== Lane CRUD Methods ====================

  /**
   * Add a new lane
   */
  addLane(lane: Lane, opts?: import('./types').AddItemOptions): Lane {
    const newLane = this.stateManager.addLane(lane, opts?.index);
    this.render();
    this.eventBus.emit('lane:add', { lane: newLane });
    this.eventBus.emit('state:change', { state: this.getState() });
    return newLane;
  }

  /**
   * Update an existing lane
   */
  updateLane(laneId: ID, patch: Partial<Lane>): Lane | null {
    const updatedLane = this.stateManager.updateLane(laneId, patch);
    if (updatedLane) {
      this.render();
      this.eventBus.emit('lane:update', { lane: updatedLane });
      this.eventBus.emit('state:change', { state: this.getState() });
    }
    return updatedLane;
  }

  /**
   * Remove a lane
   */
  removeLane(laneId: ID): boolean {
    const success = this.stateManager.removeLane(laneId);
    if (success) {
      this.render();
      this.eventBus.emit('lane:remove', { laneId });
      this.eventBus.emit('state:change', { state: this.getState() });
    }
    return success;
  }

  /**
   * Move a lane to a new position
   */
  moveLane(laneId: ID, toIndex: number): boolean {
    const lane = this.stateManager.getLane(laneId);
    if (!lane) return false;

    // Update lane order
    const updatedLane = this.stateManager.updateLane(laneId, { order: toIndex });
    if (updatedLane) {
      this.render();
      this.eventBus.emit('lane:move', { lane: updatedLane, toIndex });
      this.eventBus.emit('state:change', { state: this.getState() });
      return true;
    }
    return false;
  }

  /**
   * Clear saved state from localStorage
   */
  clearStorage(): boolean {
    if (!this.storageManager) return false;
    return this.storageManager.clear();
  }

  /**
   * Destroy the board
   */
  destroy(): void {
    if (this.destroyed) return;

    this.eventBus.emit('board:destroy');
    
    // Destroy drag and drop
    if (this.dndManager) {
      this.dndManager.destroy();
      this.dndManager = null;
    }

    // Destroy accessibility
    if (this.a11yManager) {
      this.a11yManager.destroy();
      this.a11yManager = null;
    }
    
    this.eventBus.clear();
    this.container.innerHTML = '';
    this.destroyed = true;
  }

  /**
   * Render the board
   */
  private render(): void {
    const lanes = this.stateManager.getLanes();
    const columns = this.stateManager.getColumns();
    const allCards = this.stateManager.getCards();

    renderBoard(
      this.container,
      lanes,
      columns,
      allCards,
      this.options.renderCard,
      this.options.renderColumnHeader,
      this.options.renderLaneHeader
    );

    // Enhance with accessibility features after rendering
    this.enhanceAccessibility();
  }

  /**
   * Check if board is destroyed
   */
  isDestroyed(): boolean {
    return this.destroyed;
  }

  /**
   * Initialize drag and drop
   */
  private initializeDragAndDrop(): void {
    if (this.dndManager) {
      this.dndManager.destroy();
    }

    this.dndManager = new DragAndDropManager(
      this.container,
      this.eventBus,
      this.options.drag,
      this.options.readonly,
      this.options.draggable
    );

    // Enhance DnD manager with state access
    this.enhanceDndManager();

    // Listen to drag events and update state
    this.setupDragEventHandlers();

    // Setup autosave
    if (this.storageManager) {
      this.eventBus.on('state:change', (data) => {
        const { state } = data as { state: KanbanState };
        this.storageManager?.save(state);
      });
    }
  }

  /**
   * Enhance DnD manager with state manager access
   */
  private enhanceDndManager(): void {
    if (!this.dndManager) return;

    // Set callbacks for card and column data access
    this.dndManager.setCardDataGetter((cardId: ID) => {
      return this.stateManager.getCard(cardId);
    });

    this.dndManager.setColumnDataGetter((columnId: ID) => {
      return this.stateManager.getColumn(columnId);
    });
  }

  /**
   * Setup drag event handlers
   */
  private setupDragEventHandlers(): void {
    // Handle drag end - update state
    this.eventBus.on('card:drag:end', (data) => {
      const { card, from, to } = data as { card: Card; from: Column; to: Column };
      if (from.id === to.id) {
        // Same column - just re-render to update positions
        this.render();
      } else {
        // Different column - move card
        const success = this.stateManager.moveCard(card.id, to.id, card.laneId);
        if (success) {
          this.render();
          this.eventBus.emit('state:change', { state: this.getState() });
        }
      }
    });
  }

  /**
   * Get state manager (for advanced use)
   */
  getStateManager(): StateManager {
    return this.stateManager;
  }

  /**
   * Initialize accessibility features
   */
  private initializeAccessibility(): void {
    if (this.a11yManager) {
      this.a11yManager.destroy();
    }

    this.a11yManager = new AccessibilityManager(
      this.container,
      this.eventBus,
      () => this.getState(),
      this.options.a11y
    );

    this.a11yManager.init();

    // Listen to a11y move events and update state
    this.setupA11yEventHandlers();
  }

  /**
   * Enhance rendered elements with accessibility features
   */
  private enhanceAccessibility(): void {
    if (!this.a11yManager) return;

    const state = this.getState();

    // Enhance all lanes
    if (state.lanes) {
      state.lanes.forEach((lane) => {
        const laneEl = this.container.querySelector(`.sk-lane[data-lane-id="${lane.id}"]`) as HTMLElement;
        if (laneEl) {
          this.a11yManager!.enhanceLane(laneEl, lane.id, lane.title);
        }
      });
    }

    // Enhance all columns
    state.columns.forEach((column) => {
      const columnEl = this.container.querySelector(`.sk-column[data-column-id="${column.id}"]`) as HTMLElement;
      if (columnEl) {
        this.a11yManager!.enhanceColumn(columnEl, column);
      }
    });

    // Enhance all cards
    state.cards.forEach((card) => {
      const cardEl = this.container.querySelector(`.sk-card[data-card-id="${card.id}"]`) as HTMLElement;
      if (cardEl) {
        this.a11yManager!.enhanceCard(cardEl, card);
      }
    });
  }

  /**
   * Setup accessibility event handlers
   */
  private setupA11yEventHandlers(): void {
    // Handle keyboard card moves
    this.eventBus.on('a11y:move:card', (data) => {
      const { card, to } = data as { card: Card; from: Column; to: Column };
      const success = this.stateManager.moveCard(card.id, to.id, card.laneId);
      if (success) {
        this.render();
        this.eventBus.emit('state:change', { state: this.getState() });
      }
    });
  }
}
