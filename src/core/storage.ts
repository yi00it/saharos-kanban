/**
 * Saharos Kanban - LocalStorage Integration
 * Handles saving and loading board state from localStorage
 */

import type { KanbanState } from './types';

/**
 * Storage Manager for LocalStorage persistence
 */
export class StorageManager {
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  /**
   * Save state to localStorage
   */
  save(state: KanbanState): boolean {
    try {
      const serialized = JSON.stringify(state);
      localStorage.setItem(this.storageKey, serialized);
      return true;
    } catch (error) {
      console.error('[Saharos] Failed to save to localStorage:', error);
      return false;
    }
  }

  /**
   * Load state from localStorage
   */
  load(): KanbanState | null {
    try {
      const serialized = localStorage.getItem(this.storageKey);
      if (!serialized) return null;
      
      const state = JSON.parse(serialized) as KanbanState;
      return state;
    } catch (error) {
      console.error('[Saharos] Failed to load from localStorage:', error);
      return null;
    }
  }

  /**
   * Clear saved state
   */
  clear(): boolean {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('[Saharos] Failed to clear localStorage:', error);
      return false;
    }
  }

  /**
   * Check if storage is available
   */
  static isAvailable(): boolean {
    try {
      const test = '__saharos_storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
}
