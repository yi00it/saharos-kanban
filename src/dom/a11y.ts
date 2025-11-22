/**
 * Saharos Kanban - Accessibility System
 * Keyboard navigation and ARIA support
 */

import type { Card, Column, KanbanState, A11yOptions, ID } from '../core/types';
import { EventBus } from '../core/events';

interface FocusPosition {
  columnId: ID;
  cardId: ID | null; // null means column header is focused
  laneId?: ID | null;
}

export class AccessibilityManager {
  private container: HTMLElement;
  private events: EventBus;
  private options: A11yOptions;
  private getState: () => KanbanState;
  
  private currentFocus: FocusPosition | null = null;
  private pickingCard: Card | null = null; // Card being moved via keyboard
  
  constructor(
    container: HTMLElement,
    events: EventBus,
    getState: () => KanbanState,
    options: A11yOptions = {}
  ) {
    this.container = container;
    this.events = events;
    this.getState = getState;
    this.options = {
      enabled: true,
      boardLabel: 'Kanban Board',
      columnLabel: (col) => col.title,
      cardLabel: (card) => card.title,
      ...options,
    };
  }

  /**
   * Initialize accessibility features
   */
  public init(): void {
    if (!this.options.enabled) return;

    this.setupKeyboardNavigation();
    this.setupARIA();
  }

  /**
   * Setup ARIA attributes on the board
   */
  private setupARIA(): void {
    const board = this.container.querySelector('.sk-board');
    if (board) {
      board.setAttribute('role', 'region');
      board.setAttribute('aria-label', this.options.boardLabel || 'Kanban Board');
    }
  }

  /**
   * Add ARIA attributes to a column element
   */
  public enhanceColumn(columnEl: HTMLElement, column: Column): void {
    if (!this.options.enabled) return;

    const cardsContainer = columnEl.querySelector('.sk-cards');
    if (cardsContainer) {
      cardsContainer.setAttribute('role', 'list');
      cardsContainer.setAttribute('aria-label', 
        this.options.columnLabel ? this.options.columnLabel(column) : column.title
      );
    }

    const header = columnEl.querySelector('.sk-column-header');
    if (header) {
      header.setAttribute('role', 'heading');
      header.setAttribute('aria-level', '2');
      header.setAttribute('tabindex', '0');
      header.setAttribute('data-column-id', String(column.id));
    }
  }

  /**
   * Add ARIA attributes to a card element
   */
  public enhanceCard(cardEl: HTMLElement, card: Card): void {
    if (!this.options.enabled) return;

    cardEl.setAttribute('role', 'listitem');
    cardEl.setAttribute('tabindex', '0');
    cardEl.setAttribute('aria-label', 
      this.options.cardLabel ? this.options.cardLabel(card) : card.title
    );
    cardEl.setAttribute('data-card-id', String(card.id));
    cardEl.setAttribute('data-column-id', String(card.columnId));
    
    if (card.laneId) {
      cardEl.setAttribute('data-lane-id', String(card.laneId));
    }

    // Add keyboard hints
    cardEl.setAttribute('aria-describedby', 'sk-keyboard-hint');
  }

  /**
   * Add ARIA attributes to a lane element
   */
  public enhanceLane(laneEl: HTMLElement, _laneId: ID, laneTitle: string): void {
    if (!this.options.enabled) return;

    const header = laneEl.querySelector('.sk-lane-header');
    if (header) {
      header.setAttribute('role', 'heading');
      header.setAttribute('aria-level', '1');
      header.setAttribute('aria-label', laneTitle);
    }
  }

  /**
   * Setup keyboard navigation
   */
  private setupKeyboardNavigation(): void {
    this.container.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.container.addEventListener('focus', this.handleFocus.bind(this), true);

    // Add keyboard hints (hidden visually but available to screen readers)
    this.addKeyboardHints();
  }

  /**
   * Add keyboard usage hints for screen readers
   */
  private addKeyboardHints(): void {
    const existing = document.getElementById('sk-keyboard-hint');
    if (existing) return;

    const hint = document.createElement('div');
    hint.id = 'sk-keyboard-hint';
    hint.className = 'sk-sr-only';
    hint.textContent = 'Use arrow keys to navigate. Press Space or Enter to pick up or drop cards. Press Escape to cancel.';
    document.body.appendChild(hint);
  }

  /**
   * Handle keyboard events
   */
  private handleKeyDown(e: KeyboardEvent): void {
    if (!this.options.enabled) return;

    const target = e.target as HTMLElement;
    
    // Check if target is a card or column header
    const isCard = target.classList.contains('sk-card');
    const isColumnHeader = target.closest('.sk-column-header') !== null;

    if (!isCard && !isColumnHeader) return;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        this.navigateVertical(-1);
        break;
      
      case 'ArrowDown':
        e.preventDefault();
        this.navigateVertical(1);
        break;
      
      case 'ArrowLeft':
        e.preventDefault();
        this.navigateHorizontal(-1);
        break;
      
      case 'ArrowRight':
        e.preventDefault();
        this.navigateHorizontal(1);
        break;
      
      case ' ':
      case 'Enter':
        e.preventDefault();
        this.handlePickDrop();
        break;
      
      case 'Escape':
        e.preventDefault();
        this.cancelPickedCard();
        break;
      
      case 'Home':
        e.preventDefault();
        this.navigateToStart();
        break;
      
      case 'End':
        e.preventDefault();
        this.navigateToEnd();
        break;
    }
  }

  /**
   * Handle focus events to track current position
   */
  private handleFocus(e: FocusEvent): void {
    const target = e.target as HTMLElement;
    
    if (target.classList.contains('sk-card')) {
      const cardId = target.dataset.cardId;
      const columnId = target.dataset.columnId;
      const laneId = target.dataset.laneId;
      
      if (cardId && columnId) {
        this.currentFocus = {
          cardId: /^\d+$/.test(cardId) ? Number(cardId) : cardId,
          columnId: /^\d+$/.test(columnId) ? Number(columnId) : columnId,
          laneId: laneId ? (/^\d+$/.test(laneId) ? Number(laneId) : laneId) : null,
        };

        const state = this.getState();
        const card = state.cards.find(c => c.id === this.currentFocus?.cardId);
        if (card && this.currentFocus) {
          this.events.emit('a11y:focus:card', { card });
        }
      }
    } else if (target.closest('.sk-column-header')) {
      const header = target.closest('.sk-column-header') as HTMLElement;
      const columnId = header.dataset.columnId;
      
      if (columnId) {
        this.currentFocus = {
          cardId: null,
          columnId: /^\d+$/.test(columnId) ? Number(columnId) : columnId,
          laneId: null,
        };
      }
    }
  }

  /**
   * Navigate vertically (up/down within same column)
   */
  private navigateVertical(direction: 1 | -1): void {
    if (!this.currentFocus) return;

    const state = this.getState();
    const cards = state.cards.filter(c => c.columnId === this.currentFocus?.columnId);

    if (!this.currentFocus) return;

    if (this.currentFocus.cardId === null) {
      // On column header, move to first/last card
      const firstCard = cards[0];
      if (direction === 1 && firstCard) {
        this.focusCard(firstCard.id);
      }
      return;
    }

    // Sort cards by order
    cards.sort((a, b) => (a.order || 0) - (b.order || 0));

    const currentIndex = cards.findIndex(c => c.id === this.currentFocus?.cardId);
    if (currentIndex === -1 || !this.currentFocus) return;

    const nextIndex = currentIndex + direction;

    if (nextIndex >= 0 && nextIndex < cards.length) {
      const nextCard = cards[nextIndex];
      if (nextCard) {
        this.focusCard(nextCard.id);
      }
    } else if (direction === -1 && nextIndex < 0) {
      // Move to column header
      this.focusColumnHeader(this.currentFocus.columnId);
    }
  }

  /**
   * Navigate horizontally (left/right to adjacent columns)
   */
  private navigateHorizontal(direction: 1 | -1): void {
    if (!this.currentFocus) return;

    const state = this.getState();
    const columns = state.columns.sort((a, b) => (a.order || 0) - (b.order || 0));

    const currentColumnIndex = columns.findIndex(c => c.id === this.currentFocus?.columnId);
    if (currentColumnIndex === -1 || !this.currentFocus) return;

    const nextColumnIndex = currentColumnIndex + direction;
    if (nextColumnIndex < 0 || nextColumnIndex >= columns.length) return;

    const nextColumn = columns[nextColumnIndex];
    if (!nextColumn) return;

    if (this.currentFocus.cardId === null) {
      // Moving between column headers
      this.focusColumnHeader(nextColumn.id);
    } else {
      // Moving to another column - focus first card or header
      const cardsInNextColumn = state.cards.filter(c => c.columnId === nextColumn.id);
      if (cardsInNextColumn.length > 0) {
        cardsInNextColumn.sort((a, b) => (a.order || 0) - (b.order || 0));
        const firstCard = cardsInNextColumn[0];
        if (firstCard) {
          this.focusCard(firstCard.id);
        }
      } else {
        this.focusColumnHeader(nextColumn.id);
      }
    }
  }

  /**
   * Navigate to start of current context
   */
  private navigateToStart(): void {
    if (!this.currentFocus) return;

    const state = this.getState();
    const cards = state.cards
      .filter(c => c.columnId === this.currentFocus?.columnId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const firstCard = cards[0];
    if (firstCard) {
      this.focusCard(firstCard.id);
    }
  }

  /**
   * Navigate to end of current context
   */
  private navigateToEnd(): void {
    if (!this.currentFocus) return;

    const state = this.getState();
    const cards = state.cards
      .filter(c => c.columnId === this.currentFocus?.columnId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const lastCard = cards[cards.length - 1];
    if (lastCard) {
      this.focusCard(lastCard.id);
    }
  }

  /**
   * Handle pick/drop card with Space or Enter
   */
  private handlePickDrop(): void {
    if (!this.currentFocus || this.currentFocus.cardId === null) return;

    const state = this.getState();
    const card = state.cards.find(c => c.id === this.currentFocus?.cardId);
    if (!card) return;

    if (this.pickingCard === null) {
      // Pick up the card
      this.pickCard(card);
    } else {
      // Drop the card
      this.dropCard(card);
    }
  }

  /**
   * Pick up a card for keyboard moving
   */
  private pickCard(card: Card): void {
    this.pickingCard = card;
    
    const cardEl = this.getCardElement(card.id);
    if (cardEl) {
      cardEl.classList.add('sk-card--picking');
      cardEl.setAttribute('aria-grabbed', 'true');
      cardEl.setAttribute('aria-label', `${card.title} - picked up. Use arrow keys to move, Space or Enter to drop, Escape to cancel.`);
    }
  }

  /**
   * Drop a picked card at current focus position
   */
  private dropCard(card: Card): void {
    if (!this.currentFocus || !this.pickingCard) return;

    const state = this.getState();
    const fromColumn = state.columns.find(c => c.id === this.pickingCard?.columnId);
    const toColumn = state.columns.find(c => c.id === this.currentFocus?.columnId);

    if (!fromColumn || !toColumn || !this.currentFocus) return;

    // Calculate new position
    let newOrder = 0;

    if (this.currentFocus.cardId !== null) {
      const targetCard = state.cards.find(c => c.id === this.currentFocus?.cardId);
      if (targetCard) {
        newOrder = targetCard.order || 0;
      }
    } else {
      // Dropped on column header, put at start
      newOrder = 0;
    }

    // Update card
    this.pickingCard.columnId = this.currentFocus.columnId;
    this.pickingCard.order = newOrder;

    // Clean up UI
    const cardEl = this.getCardElement(this.pickingCard.id);
    if (cardEl) {
      cardEl.classList.remove('sk-card--picking');
      cardEl.removeAttribute('aria-grabbed');
      cardEl.setAttribute('aria-label', this.options.cardLabel ? this.options.cardLabel(card) : card.title);
    }

    // Emit event
    this.events.emit('a11y:move:card', {
      card: this.pickingCard,
      from: fromColumn,
      to: toColumn,
    });

    this.pickingCard = null;
  }

  /**
   * Cancel picking a card
   */
  private cancelPickedCard(): void {
    if (!this.pickingCard) return;

    const cardEl = this.getCardElement(this.pickingCard.id);
    if (cardEl) {
      cardEl.classList.remove('sk-card--picking');
      cardEl.removeAttribute('aria-grabbed');
      cardEl.setAttribute('aria-label', 
        this.options.cardLabel ? this.options.cardLabel(this.pickingCard) : this.pickingCard.title
      );
    }

    this.pickingCard = null;
  }

  /**
   * Focus a card element
   */
  private focusCard(cardId: ID): void {
    const cardEl = this.getCardElement(cardId);
    if (cardEl) {
      cardEl.focus();
    }
  }

  /**
   * Focus a column header
   */
  private focusColumnHeader(columnId: ID): void {
    const columnEl = this.container.querySelector(`.sk-column[data-column-id="${columnId}"]`);
    if (columnEl) {
      const header = columnEl.querySelector('.sk-column-header') as HTMLElement;
      if (header) {
        header.focus();
      }
    }
  }

  /**
   * Get card element by ID
   */
  private getCardElement(cardId: ID): HTMLElement | null {
    return this.container.querySelector(`.sk-card[data-card-id="${cardId}"]`);
  }

  /**
   * Destroy accessibility features
   */
  public destroy(): void {
    this.container.removeEventListener('keydown', this.handleKeyDown.bind(this));
    this.container.removeEventListener('focus', this.handleFocus.bind(this), true);
    
    const hint = document.getElementById('sk-keyboard-hint');
    if (hint) {
      hint.remove();
    }
  }
}
