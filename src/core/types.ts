/**
 * Saharos Kanban - Core Type Definitions
 * Zero-dependency Kanban board library
 */

export type ID = string | number;

/**
 * Lane represents a horizontal swimlane in the Kanban board
 */
export interface Lane {
  id: ID;
  title: string;
  order?: number;
  meta?: Record<string, unknown>;
}

/**
 * Column represents a vertical column (e.g., "To Do", "In Progress", "Done")
 */
export interface Column {
  id: ID;
  title: string;
  laneId?: ID | null;
  order?: number;
  meta?: Record<string, unknown>;
}

/**
 * Card represents a single task/item in the Kanban board
 */
export interface Card {
  id: ID;
  title: string;
  columnId: ID;
  laneId?: ID | null;
  description?: string;
  order?: number;
  labels?: string[];
  meta?: Record<string, unknown>;
}

/**
 * Complete state of the Kanban board
 */
export interface KanbanState {
  lanes?: Lane[];
  columns: Column[];
  cards: Card[];
}

/**
 * Column-specific rules for validation and constraints
 */
export interface ColumnRule {
  maxCards?: number;
  acceptsCards?: boolean;
  customValidator?: (card: Card) => boolean;
}

/**
 * Drag and drop configuration options
 */
export interface DragOptions {
  handleSelector?: string | null;
  mirrorClass?: string;
  hoverClassColumn?: string;
  hoverClassCardPlaceholder?: string;
  pointerTolerance?: number;
}

/**
 * Accessibility configuration options
 */
export interface A11yOptions {
  enabled?: boolean;
  boardLabel?: string;
  columnLabel?: (col: Column) => string;
  cardLabel?: (card: Card) => string;
}

/**
 * Render helpers passed to custom render hooks
 */
export interface RenderHelpers {
  createElement: (tag: string, className?: string) => HTMLElement;
  escapeHtml: (str: string) => string;
  addClass: (el: HTMLElement, ...classes: string[]) => void;
  removeClass: (el: HTMLElement, ...classes: string[]) => void;
  defaultCardRenderer: (card: Card) => HTMLElement;
  defaultColumnHeaderRenderer: (col: Column) => HTMLElement;
  defaultLaneHeaderRenderer: (lane: Lane) => HTMLElement;
}

/**
 * Custom render hooks
 */
export type RenderCardHook = (card: Card, helpers: RenderHelpers) => HTMLElement;
export type RenderColumnHeaderHook = (col: Column, helpers: RenderHelpers) => HTMLElement;
export type RenderLaneHeaderHook = (lane: Lane, helpers: RenderHelpers) => HTMLElement;

/**
 * Event types
 */
export type SaharosEvent =
  | 'board:ready'
  | 'board:destroy'
  | 'state:change'
  | 'column:add'
  | 'column:update'
  | 'column:remove'
  | 'column:move'
  | 'lane:add'
  | 'lane:update'
  | 'lane:remove'
  | 'lane:move'
  | 'card:add'
  | 'card:update'
  | 'card:remove'
  | 'card:click'
  | 'card:dblclick'
  | 'card:drag:start'
  | 'card:drag:over'
  | 'card:drag:end'
  | 'card:drag:cancel'
  | 'a11y:focus:card'
  | 'a11y:move:card';

/**
 * Event handler signature
 */
export type EventHandler<T = unknown> = (data: T) => void;

/**
 * Event handlers mapping
 */
export interface SaharosEventHandlers {
  'board:ready': EventHandler<void>;
  'board:destroy': EventHandler<void>;
  'state:change': EventHandler<{ state: KanbanState }>;
  'column:add': EventHandler<{ column: Column }>;
  'column:update': EventHandler<{ column: Column }>;
  'column:remove': EventHandler<{ columnId: ID }>;
  'column:move': EventHandler<{ column: Column; toIndex: number }>;
  'lane:add': EventHandler<{ lane: Lane }>;
  'lane:update': EventHandler<{ lane: Lane }>;
  'lane:remove': EventHandler<{ laneId: ID }>;
  'lane:move': EventHandler<{ lane: Lane; toIndex: number }>;
  'card:add': EventHandler<{ card: Card }>;
  'card:update': EventHandler<{ card: Card }>;
  'card:remove': EventHandler<{ cardId: ID }>;
  'card:click': EventHandler<{ card: Card; event: MouseEvent }>;
  'card:dblclick': EventHandler<{ card: Card; event: MouseEvent }>;
  'card:drag:start': EventHandler<{ card: Card; event: PointerEvent }>;
  'card:drag:over': EventHandler<{ card: Card; column: Column }>;
  'card:drag:end': EventHandler<{ card: Card; from: Column; to: Column }>;
  'card:drag:cancel': EventHandler<{ card: Card }>;
  'a11y:focus:card': EventHandler<{ card: Card }>;
  'a11y:move:card': EventHandler<{ card: Card; from: Column; to: Column }>;
}

/**
 * Plugin context passed to plugins
 */
export interface PluginContext {
  board: unknown; // Will be SaharosKanban instance
  getState: () => KanbanState;
  setState: (state: KanbanState, opts?: { silent?: boolean }) => void;
  on: <K extends SaharosEvent>(event: K, handler: EventHandler) => void;
  off: <K extends SaharosEvent>(event: K, handler: EventHandler) => void;
  emit: <K extends SaharosEvent>(event: K, data?: unknown) => void;
  options: SaharosKanbanOptions;
}

/**
 * Plugin function signature
 */
export type SaharosKanbanPlugin = (ctx: PluginContext) => void;

/**
 * Main options for SaharosKanban constructor
 */
export interface SaharosKanbanOptions {
  lanes?: Lane[];
  columns?: Column[];
  cards?: Card[];
  initialState?: KanbanState;

  id?: string;
  storageKey?: string | null;

  readonly?: boolean;
  draggable?: boolean;
  sortable?: boolean;

  scrollContainer?: HTMLElement | Window;

  columnWidth?: number | 'auto';
  columnMinWidth?: number;
  columnMaxWidth?: number;

  drag?: DragOptions;

  columnRules?: {
    [columnId: string]: ColumnRule;
  };

  renderCard?: RenderCardHook;
  renderColumnHeader?: RenderColumnHeaderHook;
  renderLaneHeader?: RenderLaneHeaderHook;

  a11y?: A11yOptions;

  on?: Partial<SaharosEventHandlers>;
  plugins?: SaharosKanbanPlugin[];

  debug?: boolean;
}

/**
 * Move card options
 */
export interface MoveCardOptions {
  cause?: 'api' | 'pointer' | 'keyboard';
}

/**
 * Load state options
 */
export interface LoadStateOptions {
  silent?: boolean;
}

/**
 * Add item options (for cards, columns, lanes)
 */
export interface AddItemOptions {
  index?: number;
}
