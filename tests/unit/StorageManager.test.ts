/**
 * Unit tests for StorageManager
 */

import { StorageManager } from '../../src/core/storage';
import type { KanbanState } from '../../src/core/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('StorageManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should save state to localStorage', () => {
    const manager = new StorageManager('test-key');
    const state: KanbanState = {
      columns: [{ id: 'todo', title: 'To Do' }],
      cards: []
    };

    const success = manager.save(state);

    expect(success).toBe(true);
    expect(localStorage.getItem('test-key')).toBeTruthy();
  });

  it('should load state from localStorage', () => {
    const manager = new StorageManager('test-key');
    const state: KanbanState = {
      columns: [{ id: 'todo', title: 'To Do' }],
      cards: [{ id: 1, title: 'Card 1', columnId: 'todo' }]
    };

    manager.save(state);
    const loaded = manager.load();

    expect(loaded).toBeDefined();
    expect(loaded?.columns).toHaveLength(1);
    expect(loaded?.cards).toHaveLength(1);
  });

  it('should return null for invalid state format', () => {
    const manager = new StorageManager('test-key');
    
    // Save malformed data
    localStorage.setItem('test-key', '{"invalid": "data"}');
    
    const loaded = manager.load();

    expect(loaded).toBeNull();
  });

  it('should clear saved state', () => {
    const manager = new StorageManager('test-key');
    const state: KanbanState = {
      columns: [{ id: 'todo', title: 'To Do' }],
      cards: []
    };

    manager.save(state);
    const success = manager.clear();

    expect(success).toBe(true);
    expect(localStorage.getItem('test-key')).toBeNull();
  });
});
