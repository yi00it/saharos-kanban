/**
 * Unit tests for StateManager
 * Run with: npm test (requires test framework setup)
 */

import { StateManager } from '../../src/core/state';
import type { Card, Column, Lane } from '../../src/core/types';

describe('StateManager', () => {
  describe('Card Operations', () => {
    it('should add a card successfully', () => {
      const manager = new StateManager({
        columns: [{ id: 'todo', title: 'To Do' }],
        cards: []
      });

      const card: Card = {
        id: 1,
        title: 'Test Card',
        columnId: 'todo'
      };

      const addedCard = manager.addCard(card);
      
      expect(addedCard.id).toBe(1);
      expect(addedCard.title).toBe('Test Card');
      expect(addedCard.order).toBeDefined();
    });

    it('should get a card by ID', () => {
      const manager = new StateManager({
        columns: [{ id: 'todo', title: 'To Do' }],
        cards: [{ id: 1, title: 'Card 1', columnId: 'todo' }]
      });

      const card = manager.getCard(1);
      
      expect(card).toBeDefined();
      expect(card?.title).toBe('Card 1');
    });

    it('should update a card', () => {
      const manager = new StateManager({
        columns: [{ id: 'todo', title: 'To Do' }],
        cards: [{ id: 1, title: 'Old Title', columnId: 'todo' }]
      });

      const updated = manager.updateCard(1, { title: 'New Title' });
      
      expect(updated?.title).toBe('New Title');
    });

    it('should remove a card', () => {
      const manager = new StateManager({
        columns: [{ id: 'todo', title: 'To Do' }],
        cards: [{ id: 1, title: 'Card 1', columnId: 'todo' }]
      });

      const success = manager.removeCard(1);
      const card = manager.getCard(1);
      
      expect(success).toBe(true);
      expect(card).toBeNull();
    });

    it('should move a card between columns', () => {
      const manager = new StateManager({
        columns: [
          { id: 'todo', title: 'To Do' },
          { id: 'done', title: 'Done' }
        ],
        cards: [{ id: 1, title: 'Card 1', columnId: 'todo' }]
      });

      const success = manager.moveCard(1, 'done');
      const card = manager.getCard(1);
      
      expect(success).toBe(true);
      expect(card?.columnId).toBe('done');
    });
  });

  describe('Column Operations', () => {
    it('should add a column', () => {
      const manager = new StateManager({ columns: [], cards: [] });
      
      const column: Column = { id: 'todo', title: 'To Do' };
      const added = manager.addColumn(column);
      
      expect(added.id).toBe('todo');
      expect(added.order).toBeDefined();
    });

    it('should get columns sorted by order', () => {
      const manager = new StateManager({
        columns: [
          { id: 'done', title: 'Done', order: 2 },
          { id: 'todo', title: 'To Do', order: 0 },
          { id: 'doing', title: 'Doing', order: 1 }
        ],
        cards: []
      });

      const columns = manager.getColumns();
      
      expect(columns[0]?.id).toBe('todo');
      expect(columns[1]?.id).toBe('doing');
      expect(columns[2]?.id).toBe('done');
    });
  });

  describe('State Validation', () => {
    it('should return a deep copy of state', () => {
      const manager = new StateManager({
        columns: [{ id: 'todo', title: 'To Do' }],
        cards: [{ id: 1, title: 'Card 1', columnId: 'todo' }]
      });

      const state1 = manager.getState();
      const state2 = manager.getState();
      
      expect(state1).not.toBe(state2); // Different objects
      expect(state1.cards[0]).not.toBe(state2.cards[0]); // Deep copy
    });
  });
});
