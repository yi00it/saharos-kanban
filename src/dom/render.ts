/**
 * Saharos Kanban - DOM Rendering
 * Handles rendering of lanes, columns, and cards
 */

import type { Lane, Column, Card, RenderHelpers } from '../core/types';

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Global render helpers instance - reused across all renders to reduce overhead
 */
let globalHelpers: RenderHelpers | null = null;

/**
 * Get or create render helpers (singleton pattern)
 */
export function createRenderHelpers(): RenderHelpers {
  if (globalHelpers) return globalHelpers;

  globalHelpers = {
    createElement: (tag: string, className?: string): HTMLElement => {
      const el = document.createElement(tag);
      if (className) el.className = className;
      return el;
    },
    escapeHtml,
    addClass: (el: HTMLElement, ...classes: string[]) => {
      el.classList.add(...classes);
    },
    removeClass: (el: HTMLElement, ...classes: string[]) => {
      el.classList.remove(...classes);
    },
    defaultCardRenderer,
    defaultColumnHeaderRenderer,
    defaultLaneHeaderRenderer,
  };

  return globalHelpers;
}

/**
 * Default card renderer - optimized for minimal DOM nodes
 */
export function defaultCardRenderer(card: Card): HTMLElement {
  const cardEl = document.createElement('div');
  cardEl.className = 'sk-card';
  cardEl.dataset.cardId = String(card.id);

  // Title - use direct text node with class for styling
  const title = document.createElement('div');
  title.className = 'sk-card-title';
  title.textContent = card.title;
  cardEl.appendChild(title);

  // Description - only create if exists
  if (card.description) {
    const desc = document.createElement('div');
    desc.className = 'sk-card-description';
    desc.textContent = card.description;
    cardEl.appendChild(desc);
  }

  // Labels - inline without wrapper container to save DOM nodes
  if (card.labels && card.labels.length > 0) {
    card.labels.forEach((label) => {
      const labelEl = document.createElement('span');
      labelEl.className = 'sk-card-label';
      labelEl.textContent = label;
      cardEl.appendChild(labelEl);
    });
  }

  return cardEl;
}

/**
 * Default column header renderer - simplified structure
 */
export function defaultColumnHeaderRenderer(col: Column): HTMLElement {
  const header = document.createElement('h3');
  header.className = 'sk-column-header';
  header.textContent = col.title;
  return header;
}

/**
 * Default lane header renderer - simplified structure
 */
export function defaultLaneHeaderRenderer(lane: Lane): HTMLElement {
  const header = document.createElement('h2');
  header.className = 'sk-lane-header';
  header.textContent = lane.title;
  return header;
}

/**
 * Render a column element
 */
export function renderColumn(
  column: Column,
  cards: Card[],
  customCardRenderer?: (card: Card, helpers: RenderHelpers) => HTMLElement,
  customHeaderRenderer?: (col: Column, helpers: RenderHelpers) => HTMLElement,
  helpers?: RenderHelpers
): HTMLElement {
  const renderHelpers = helpers || createRenderHelpers();
  const columnEl = document.createElement('div');
  columnEl.className = 'sk-column';
  columnEl.dataset.columnId = String(column.id);

  // Header
  const header = customHeaderRenderer
    ? customHeaderRenderer(column, renderHelpers)
    : defaultColumnHeaderRenderer(column);
  columnEl.appendChild(header);

  // Cards container
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'sk-cards';

  cards.forEach((card) => {
    const cardEl = customCardRenderer
      ? customCardRenderer(card, renderHelpers)
      : defaultCardRenderer(card);
    cardsContainer.appendChild(cardEl);
  });

  columnEl.appendChild(cardsContainer);

  return columnEl;
}

/**
 * Render a lane element
 */
export function renderLane(
  lane: Lane,
  columns: Column[],
  cards: Card[],
  customCardRenderer?: (card: Card, helpers: RenderHelpers) => HTMLElement,
  customColumnHeaderRenderer?: (col: Column, helpers: RenderHelpers) => HTMLElement,
  customLaneHeaderRenderer?: (lane: Lane, helpers: RenderHelpers) => HTMLElement,
  helpers?: RenderHelpers
): HTMLElement {
  const renderHelpers = helpers || createRenderHelpers();
  const laneEl = document.createElement('div');
  laneEl.className = 'sk-lane';
  laneEl.dataset.laneId = String(lane.id);

  // Lane header
  const header = customLaneHeaderRenderer
    ? customLaneHeaderRenderer(lane, renderHelpers)
    : defaultLaneHeaderRenderer(lane);
  laneEl.appendChild(header);

  // Columns container
  const columnsContainer = document.createElement('div');
  columnsContainer.className = 'sk-columns';

  columns.forEach((column) => {
    const columnCards = cards.filter(
      (card) => card.columnId === column.id && card.laneId === lane.id
    );
    const columnEl = renderColumn(column, columnCards, customCardRenderer, customColumnHeaderRenderer, renderHelpers);
    columnsContainer.appendChild(columnEl);
  });

  laneEl.appendChild(columnsContainer);

  return laneEl;
}

/**
 * Render the entire board
 */
export function renderBoard(
  container: HTMLElement,
  lanes: Lane[],
  columns: Column[],
  cards: Card[],
  customCardRenderer?: (card: Card, helpers: RenderHelpers) => HTMLElement,
  customColumnHeaderRenderer?: (col: Column, helpers: RenderHelpers) => HTMLElement,
  customLaneHeaderRenderer?: (lane: Lane, helpers: RenderHelpers) => HTMLElement
): void {
  // Clear existing content
  container.innerHTML = '';
  container.className = 'sk-board';

  // Create render helpers once for entire board render
  const helpers = createRenderHelpers();

  if (lanes.length > 0) {
    // Render with lanes
    lanes.forEach((lane) => {
      const laneColumns = columns.filter((col) => col.laneId === lane.id);
      const laneEl = renderLane(
        lane,
        laneColumns,
        cards,
        customCardRenderer,
        customColumnHeaderRenderer,
        customLaneHeaderRenderer,
        helpers
      );
      container.appendChild(laneEl);
    });
  } else {
    // Render without lanes (simple column layout)
    const columnsContainer = document.createElement('div');
    columnsContainer.className = 'sk-columns';

    columns.forEach((column) => {
      const columnCards = cards.filter((card) => card.columnId === column.id);
      const columnEl = renderColumn(column, columnCards, customCardRenderer, customColumnHeaderRenderer, helpers);
      columnsContainer.appendChild(columnEl);
    });

    container.appendChild(columnsContainer);
  }
}
