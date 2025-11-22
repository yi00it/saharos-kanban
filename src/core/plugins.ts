/**
 * Saharos Kanban - Plugin System & Example Plugins
 * Extensible plugin architecture with helper utilities
 */

import type { SaharosKanbanPlugin, PluginContext, Card, Column } from './types';

/**
 * WIP Limit Plugin
 * Prevents adding cards to columns that exceed their WIP limit
 * 
 * Usage:
 * ```js
 * import { wipLimitPlugin } from 'saharos-kanban';
 * 
 * const board = new SaharosKanban('#board', {
 *   columns: [
 *     { id: 'todo', title: 'To Do', meta: { wipLimit: 5 } },
 *     { id: 'doing', title: 'Doing', meta: { wipLimit: 3 } }
 *   ],
 *   plugins: [wipLimitPlugin()]
 * });
 * ```
 */
export function wipLimitPlugin(options: {
  showWarning?: boolean;
  warningClass?: string;
  onLimitExceeded?: (column: Column, limit: number, current: number) => void;
} = {}): SaharosKanbanPlugin {
  const {
    showWarning = true,
    warningClass = 'sk-wip-warning',
    onLimitExceeded = () => {},
  } = options;

  return (ctx: PluginContext) => {
    // Check WIP limits before card moves
    ctx.on('card:drag:end', ({ to }) => {
      const state = ctx.getState();
      const wipLimit = to.meta?.wipLimit as number | undefined;
      
      if (wipLimit !== undefined) {
        const cardsInColumn = state.cards.filter(c => c.columnId === to.id);
        
        if (cardsInColumn.length > wipLimit) {
          onLimitExceeded(to, wipLimit, cardsInColumn.length);
          
          if (showWarning) {
            const columnEl = document.querySelector(`.sk-column[data-column-id="${to.id}"]`);
            if (columnEl) {
              columnEl.classList.add(warningClass);
              setTimeout(() => columnEl.classList.remove(warningClass), 2000);
            }
          }
        }
      }
    });

    // Also check on keyboard moves
    ctx.on('a11y:move:card', ({ to }) => {
      const state = ctx.getState();
      const wipLimit = to.meta?.wipLimit as number | undefined;
      
      if (wipLimit !== undefined) {
        const cardsInColumn = state.cards.filter(c => c.columnId === to.id);
        
        if (cardsInColumn.length > wipLimit) {
          onLimitExceeded(to, wipLimit, cardsInColumn.length);
        }
      }
    });

    // Visual indicators on render
    ctx.on('state:change', () => {
      const state = ctx.getState();
      
      state.columns.forEach(column => {
        const wipLimit = column.meta?.wipLimit as number | undefined;
        if (wipLimit !== undefined) {
          const cardsInColumn = state.cards.filter(c => c.columnId === column.id);
          const columnEl = document.querySelector(`.sk-column[data-column-id="${column.id}"]`);
          
          if (columnEl) {
            // Add data attribute for CSS styling
            columnEl.setAttribute('data-wip-limit', String(wipLimit));
            columnEl.setAttribute('data-wip-count', String(cardsInColumn.length));
            
            if (cardsInColumn.length >= wipLimit) {
              columnEl.classList.add('sk-wip-at-limit');
            } else {
              columnEl.classList.remove('sk-wip-at-limit');
            }
            
            if (cardsInColumn.length > wipLimit) {
              columnEl.classList.add('sk-wip-exceeded');
            } else {
              columnEl.classList.remove('sk-wip-exceeded');
            }
          }
        }
      });
    });
  };
}

/**
 * Card Aging Plugin
 * Adds visual indicators to cards based on how long they've been in a column
 * 
 * Usage:
 * ```js
 * import { cardAgingPlugin } from 'saharos-kanban';
 * 
 * const board = new SaharosKanban('#board', {
 *   plugins: [cardAgingPlugin({
 *     days: { warning: 3, danger: 7 }
 *   })]
 * });
 * ```
 */
export function cardAgingPlugin(options: {
  days?: { warning: number; danger: number };
  classes?: { warning: string; danger: string };
  trackField?: string;
} = {}): SaharosKanbanPlugin {
  const {
    days = { warning: 3, danger: 7 },
    classes = { warning: 'sk-card-aging-warning', danger: 'sk-card-aging-danger' },
    trackField = 'movedAt',
  } = options;

  return (ctx: PluginContext) => {
    // Track when cards move to new columns
    ctx.on('card:drag:end', ({ card }) => {
      const state = ctx.getState();
      const stateCard = state.cards.find(c => c.id === card.id);
      if (stateCard) {
        updateCardTimestamp(stateCard);
        ctx.setState(state, { silent: true });
      }
    });

    ctx.on('a11y:move:card', ({ card }) => {
      const state = ctx.getState();
      const stateCard = state.cards.find(c => c.id === card.id);
      if (stateCard) {
        updateCardTimestamp(stateCard);
        ctx.setState(state, { silent: true });
      }
    });

    // Update visual indicators
    ctx.on('state:change', () => {
      updateCardAges();
    });

    // Initialize timestamps for existing cards
    ctx.on('board:ready', () => {
      const state = ctx.getState();
      let changed = false;
      
      state.cards.forEach(card => {
        if (!card.meta?.[trackField]) {
          if (!card.meta) card.meta = {};
          card.meta[trackField] = Date.now();
          changed = true;
        }
      });
      
      if (changed) {
        ctx.setState(state, { silent: true });
      }
      
      updateCardAges();
    });

    function updateCardTimestamp(card: Card) {
      if (!card.meta) card.meta = {};
      card.meta[trackField] = Date.now();
    }

    function updateCardAges() {
      const state = ctx.getState();
      const now = Date.now();
      
      state.cards.forEach(card => {
        const movedAt = card.meta?.[trackField] as number | undefined;
        if (!movedAt) return;
        
        const ageInDays = (now - movedAt) / (1000 * 60 * 60 * 24);
        const cardEl = document.querySelector(`.sk-card[data-card-id="${card.id}"]`);
        
        if (cardEl) {
          cardEl.classList.remove(classes.warning, classes.danger);
          
          if (ageInDays >= days.danger) {
            cardEl.classList.add(classes.danger);
            cardEl.setAttribute('data-card-age', 'danger');
          } else if (ageInDays >= days.warning) {
            cardEl.classList.add(classes.warning);
            cardEl.setAttribute('data-card-age', 'warning');
          } else {
            cardEl.setAttribute('data-card-age', 'normal');
          }
          
          cardEl.setAttribute('data-card-days', Math.floor(ageInDays).toString());
        }
      });
    }
  };
}

/**
 * Column Collapsing Plugin
 * Allows columns to be collapsed/expanded to save screen space
 * 
 * Usage:
 * ```js
 * import { columnCollapsePlugin } from 'saharos-kanban';
 * 
 * const board = new SaharosKanban('#board', {
 *   plugins: [columnCollapsePlugin()]
 * });
 * ```
 */
export function columnCollapsePlugin(options: {
  collapsedClass?: string;
  buttonClass?: string;
  storageKey?: string | null;
} = {}): SaharosKanbanPlugin {
  const {
    collapsedClass = 'sk-column-collapsed',
    buttonClass = 'sk-column-toggle',
    storageKey = 'sk-collapsed-columns',
  } = options;

  const collapsedColumns = new Set<string | number>();

  return (ctx: PluginContext) => {
    // Load collapsed state from storage
    if (storageKey && typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const ids = JSON.parse(saved);
          ids.forEach((id: string | number) => collapsedColumns.add(id));
        }
      } catch (e) {
        console.warn('Failed to load collapsed columns state:', e);
      }
    }

    // Add toggle buttons to column headers
    ctx.on('state:change', () => {
      addToggleButtons();
      applyCollapsedState();
    });

    ctx.on('board:ready', () => {
      addToggleButtons();
      applyCollapsedState();
    });

    function addToggleButtons() {
      const state = ctx.getState();
      
      state.columns.forEach(column => {
        const columnEl = document.querySelector(`.sk-column[data-column-id="${column.id}"]`);
        if (!columnEl) return;
        
        const header = columnEl.querySelector('.sk-column-header');
        if (!header) return;
        
        // Check if button already exists
        if (header.querySelector(`.${buttonClass}`)) return;
        
        const button = document.createElement('button');
        button.className = buttonClass;
        button.setAttribute('aria-label', 'Toggle column');
        button.innerHTML = '−';
        button.style.cssText = `
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.25rem;
          padding: 0.25rem 0.5rem;
          margin-left: auto;
          color: inherit;
          opacity: 0.6;
          transition: opacity 0.2s;
        `;
        
        button.addEventListener('mouseenter', () => {
          button.style.opacity = '1';
        });
        
        button.addEventListener('mouseleave', () => {
          button.style.opacity = '0.6';
        });
        
        button.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleColumn(column.id);
        });

        (header as HTMLElement).style.display = 'flex';
        (header as HTMLElement).style.alignItems = 'center';
        header.appendChild(button);
      });
    }

    function toggleColumn(columnId: string | number) {
      if (collapsedColumns.has(columnId)) {
        collapsedColumns.delete(columnId);
      } else {
        collapsedColumns.add(columnId);
      }
      
      saveCollapsedState();
      applyCollapsedState();
    }

    function applyCollapsedState() {
      const state = ctx.getState();
      
      state.columns.forEach(column => {
        const columnEl = document.querySelector(`.sk-column[data-column-id="${column.id}"]`) as HTMLElement;
        if (!columnEl) return;
        
        const isCollapsed = collapsedColumns.has(column.id);
        const button = columnEl.querySelector(`.${buttonClass}`) as HTMLButtonElement;
        const cardsContainer = columnEl.querySelector('.sk-cards') as HTMLElement;
        
        if (isCollapsed) {
          columnEl.classList.add(collapsedClass);
          if (button) button.innerHTML = '+';
          if (cardsContainer) cardsContainer.style.display = 'none';
          columnEl.style.width = 'auto';
          columnEl.style.minWidth = 'auto';
        } else {
          columnEl.classList.remove(collapsedClass);
          if (button) button.innerHTML = '−';
          if (cardsContainer) cardsContainer.style.display = '';
          columnEl.style.width = '';
          columnEl.style.minWidth = '';
        }
      });
    }

    function saveCollapsedState() {
      if (storageKey && typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem(storageKey, JSON.stringify(Array.from(collapsedColumns)));
        } catch (e) {
          console.warn('Failed to save collapsed columns state:', e);
        }
      }
    }
  };
}

/**
 * Plugin Helper: Add CSS styles dynamically
 */
export function addPluginStyles(styleId: string, css: string): void {
  if (document.getElementById(styleId)) return;
  
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = css;
  document.head.appendChild(style);
}

/**
 * Plugin Helper: Debounce function
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Plugin Helper: Throttle function
 */
export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
