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
   * Validate that a value is a valid KanbanState
   */
  private validateState(state: unknown): state is KanbanState {
    if (!state || typeof state !== 'object') return false;

    const s = state as Record<string, unknown>;

    // Validate columns array
    if (!Array.isArray(s.columns)) return false;
    if (!s.columns.every((col: unknown) =>
      typeof col === 'object' &&
      col !== null &&
      'id' in col &&
      'title' in col
    )) return false;

    // Validate cards array
    if (!Array.isArray(s.cards)) return false;
    if (!s.cards.every((card: unknown) =>
      typeof card === 'object' &&
      card !== null &&
      'id' in card &&
      'title' in card &&
      'columnId' in card
    )) return false;

    // Validate lanes array (optional)
    if (s.lanes !== undefined) {
      if (!Array.isArray(s.lanes)) return false;
      if (!s.lanes.every((lane: unknown) =>
        typeof lane === 'object' &&
        lane !== null &&
        'id' in lane &&
        'title' in lane
      )) return false;
    }

    return true;
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

      const state = JSON.parse(serialized) as unknown;

      // Validate the loaded state to prevent injection attacks
      if (!this.validateState(state)) {
        console.error('[Saharos] Invalid state format in localStorage. State has been cleared.');
        this.clear();
        return null;
      }

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
