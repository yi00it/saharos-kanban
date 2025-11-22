/**
 * Saharos Kanban - State Management
 * Manages the canonical state of the Kanban board
 */

import type { KanbanState, Lane, Column, Card, ID } from './types';

/**
 * State Manager class
 * Single source of truth for all board data
 */
export class StateManager {
  private state: KanbanState;

  constructor(initialState?: Partial<KanbanState>) {
    this.state = {
      lanes: initialState?.lanes ?? [],
      columns: initialState?.columns ?? [],
      cards: initialState?.cards ?? [],
    };

    // Ensure order properties are set
    this.normalizeOrders();
  }

  /**
   * Get the current state (read-only copy)
   */
  getState(): KanbanState {
    return JSON.parse(JSON.stringify(this.state)) as KanbanState;
  }

  /**
   * Set the entire state
   */
  setState(newState: KanbanState): void {
    this.state = {
      lanes: newState.lanes ?? [],
      columns: newState.columns ?? [],
      cards: newState.cards ?? [],
    };
    this.normalizeOrders();
  }

  /**
   * Get lanes sorted by order
   */
  getLanes(): Lane[] {
    return [...(this.state.lanes ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  /**
   * Get columns sorted by order
   */
  getColumns(laneId?: ID | null): Column[] {
    const columns = laneId !== undefined
      ? this.state.columns.filter((col) => col.laneId === laneId)
      : this.state.columns;
    return [...columns].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  /**
   * Get cards sorted by order
   */
  getCards(columnId?: ID, laneId?: ID | null): Card[] {
    let cards = this.state.cards;

    if (columnId !== undefined) {
      cards = cards.filter((card) => card.columnId === columnId);
    }

    if (laneId !== undefined) {
      cards = cards.filter((card) => card.laneId === laneId);
    }

    return [...cards].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  /**
   * Get a single lane by ID
   */
  getLane(laneId: ID): Lane | null {
    return this.state.lanes?.find((lane) => lane.id === laneId) ?? null;
  }

  /**
   * Get a single column by ID
   */
  getColumn(columnId: ID): Column | null {
    return this.state.columns.find((col) => col.id === columnId) ?? null;
  }

  /**
   * Get a single card by ID
   */
  getCard(cardId: ID): Card | null {
    return this.state.cards.find((card) => card.id === cardId) ?? null;
  }

  /**
   * Add a lane
   */
  addLane(lane: Lane, index?: number): Lane {
    const lanes = this.state.lanes ?? [];
    const newLane = { ...lane, order: index ?? lanes.length };
    
    if (index !== undefined) {
      lanes.splice(index, 0, newLane);
      this.reorderLanes();
    } else {
      lanes.push(newLane);
    }
    
    this.state.lanes = lanes;
    return newLane;
  }

  /**
   * Update a lane
   */
  updateLane(laneId: ID, patch: Partial<Lane>): Lane | null {
    const lanes = this.state.lanes ?? [];
    const index = lanes.findIndex((lane) => lane.id === laneId);

    if (index === -1) return null;

    const currentLane = lanes[index];
    if (!currentLane) return null;
    const updatedLane: Lane = { ...currentLane, ...patch, id: laneId, title: patch.title ?? currentLane.title };
    lanes[index] = updatedLane;
    this.state.lanes = lanes;
    return updatedLane;
  }

  /**
   * Remove a lane
   */
  removeLane(laneId: ID): boolean {
    const lanes = this.state.lanes ?? [];
    const index = lanes.findIndex((lane) => lane.id === laneId);
    
    if (index === -1) return false;
    
    lanes.splice(index, 1);
    this.state.lanes = lanes;
    this.reorderLanes();
    return true;
  }

  /**
   * Add a column
   */
  addColumn(column: Column, index?: number): Column {
    const newColumn = { ...column, order: index ?? this.state.columns.length };
    
    if (index !== undefined) {
      this.state.columns.splice(index, 0, newColumn);
      this.reorderColumns();
    } else {
      this.state.columns.push(newColumn);
    }
    
    return newColumn;
  }

  /**
   * Update a column
   */
  updateColumn(columnId: ID, patch: Partial<Column>): Column | null {
    const index = this.state.columns.findIndex((col) => col.id === columnId);

    if (index === -1) return null;

    const currentColumn = this.state.columns[index];
    if (!currentColumn) return null;
    const updatedColumn: Column = { ...currentColumn, ...patch, id: columnId, title: patch.title ?? currentColumn.title };
    this.state.columns[index] = updatedColumn;
    return updatedColumn;
  }

  /**
   * Remove a column
   */
  removeColumn(columnId: ID): boolean {
    const index = this.state.columns.findIndex((col) => col.id === columnId);
    
    if (index === -1) return false;
    
    this.state.columns.splice(index, 1);
    this.reorderColumns();
    return true;
  }

  /**
   * Add a card
   */
  addCard(card: Card, index?: number): Card {
    const cardsInColumn = this.getCards(card.columnId, card.laneId);
    const newCard = { ...card, order: index ?? cardsInColumn.length };
    
    if (index !== undefined) {
      this.state.cards.push(newCard);
      this.reorderCards(card.columnId, card.laneId);
    } else {
      this.state.cards.push(newCard);
    }
    
    return newCard;
  }

  /**
   * Update a card
   */
  updateCard(cardId: ID, patch: Partial<Card>): Card | null {
    const index = this.state.cards.findIndex((card) => card.id === cardId);

    if (index === -1) return null;

    const currentCard = this.state.cards[index];
    if (!currentCard) return null;
    const updatedCard: Card = { ...currentCard, ...patch, id: cardId, title: patch.title ?? currentCard.title, columnId: patch.columnId ?? currentCard.columnId };
    this.state.cards[index] = updatedCard;
    return updatedCard;
  }

  /**
   * Remove a card
   */
  removeCard(cardId: ID): boolean {
    const index = this.state.cards.findIndex((card) => card.id === cardId);

    if (index === -1) return false;

    const card = this.state.cards[index];
    if (!card) return false;
    this.state.cards.splice(index, 1);
    this.reorderCards(card.columnId, card.laneId);
    return true;
  }

  /**
   * Move a card to a new column/lane and/or position
   */
  moveCard(cardId: ID, toColumnId: ID, toLaneId?: ID | null, toIndex?: number): boolean {
    const cardIndex = this.state.cards.findIndex((c) => c.id === cardId);
    if (cardIndex === -1) return false;

    const card = this.state.cards[cardIndex];
    if (!card) return false;

    const oldColumnId = card.columnId;
    const oldLaneId = card.laneId;

    // Update card
    card.columnId = toColumnId;
    if (toLaneId !== undefined) {
      card.laneId = toLaneId;
    }

    // Reorder old and new columns
    if (oldColumnId !== toColumnId || oldLaneId !== (toLaneId ?? card.laneId)) {
      this.reorderCards(oldColumnId, oldLaneId);
      this.reorderCards(toColumnId, toLaneId ?? card.laneId);
    }

    // Move to specific index if provided
    if (toIndex !== undefined) {
      card.order = toIndex;
      this.reorderCards(toColumnId, toLaneId ?? card.laneId);
    }

    return true;
  }

  /**
   * Normalize orders for all entities
   */
  private normalizeOrders(): void {
    // Lanes
    if (this.state.lanes) {
      this.state.lanes.forEach((lane, index) => {
        if (lane.order === undefined) lane.order = index;
      });
    }

    // Columns
    this.state.columns.forEach((col, index) => {
      if (col.order === undefined) col.order = index;
    });

    // Cards
    this.state.cards.forEach((card, index) => {
      if (card.order === undefined) card.order = index;
    });
  }

  /**
   * Reorder lanes sequentially
   */
  private reorderLanes(): void {
    const lanes = this.getLanes();
    lanes.forEach((lane, index) => {
      lane.order = index;
    });
  }

  /**
   * Reorder columns sequentially
   */
  private reorderColumns(): void {
    const columns = this.getColumns();
    columns.forEach((col, index) => {
      col.order = index;
    });
  }

  /**
   * Reorder cards in a specific column sequentially
   */
  private reorderCards(columnId: ID, laneId?: ID | null): void {
    const cards = this.getCards(columnId, laneId);
    cards.forEach((card, index) => {
      card.order = index;
    });
  }
}
