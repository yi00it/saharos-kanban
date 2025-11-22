# SAHAROS-KANBAN.md
### Master Specification, Roadmap, API & Engineering Instructions  
### Project Brain – v1.0

---

# 0. Overview

**Saharos-Kanban** is a high-quality, world-class, **Vanilla JavaScript** Kanban board plugin designed to be:

- Framework-agnostic (works with Rails, Laravel, React, Vue, Svelte, plain HTML)
- Fully dependency-free
- Simple to initialize
- Powerful, extensible, event-driven
- Production-ready and customizable
- Easy to integrate into any dashboard or project management UI
- Built with modern web standards (Pointer Events, ARIA, modular architecture)

Inspired by:

- **Gridstack.js** (clean API, modular architecture)  
- **jKanban** (simple, dependency-free)  
- Trello-style UX patterns

Saharos-Kanban aims to become the **definitive Vanilla JS Kanban library**.

---

# 1. Project Goals

✔ Zero dependencies  
✔ Clean architecture  
✔ Native drag & drop  
✔ Custom rendering hooks  
✔ Plugin system  
✔ Full JSON state management  
✔ High performance  
✔ Accessibility support  
✔ Mobile and touch friendly  
✔ ESM & UMD builds  

---

# 2. Roadmap

## Milestone 1 — Foundation (v0.1.0)
- Setup repo & folder structure
- Vite/Rollup library build
- ESLint + Prettier
- TS internal, JS output
- Basic DOM rendering: lanes → columns → cards
- Core CSS theme
- Basic example page

## Milestone 2 — Drag & Drop (v0.2.0)
- Pointer-based drag engine
- Reordering inside column
- Moving cards cross-columns
- Hit-testing system
- Hover feedback & placeholders
- `drag:start`, `drag:over`, `drag:end` events

## Milestone 3 — Full API (v0.3.0)
- CRUD methods for Cards, Columns, Lanes
- State manager
- `getState()`, `loadState()`
- LocalStorage autosave
- Full event bus

## Milestone 4 — Custom Rendering (v0.4.0)
- Render hooks:
  - `renderCard`
  - `renderColumnHeader`
  - `renderLaneHeader`
- Templates & helper renderers
- Example: custom card layout
- Theme support with CSS variables

## Milestone 5 — Accessibility & Mobile (v0.5.0)
- Keyboard navigation
- ARIA roles
- Focus system
- Touch support

## Milestone 6 — Plugin System (v0.6.0)
- `use(plugin)`
- Plugin context API
- Example plugins:
  - WIP limits  
  - Card aging  
  - Column collapsing  

## Milestone 7 — v1.0.0 Release
- Documentation website
- Multiple themes
- CDN builds
- Full examples gallery
- Test suite GitHub Actions
- Publish to npm + versioning

---

# 3. Technical Architecture

## 3.1 Folder Structure

```
saharos-kanban/
├── src/
│   ├── core/
│   │   ├── Kanban.ts
│   │   ├── state.ts
│   │   ├── dnd.ts
│   │   ├── events.ts
│   │   ├── plugins.ts
│   ├── dom/
│   │   ├── render.ts
│   │   ├── templates/
│   │   └── a11y.ts
│   ├── styles/
│   │   └── index.css
│   └── index.ts
├── dist/
├── examples/
│   ├── basic.html
│   ├── custom-render.html
│   ├── plugin-wip.html
├── tests/
│   ├── unit/
│   └── e2e/
└── README.md
```

---

# 3.2 Design Principles

### 1. State is the single source of truth
All DOM reflects the canonical JS state.

### 2. Events drive everything  
Every operation emits consistent events.

### 3. Rendering is modular  
Core renders simple HTML; apps override via hooks.

### 4. Plugins extend behavior  
Plugins get access to state, events, board instance.

### 5. Minimal DOM updates  
Never rerender entire board.

---

# 3.3 Drag & Drop Engine

Uses Pointer Events:

- pointerdown
- pointermove
- pointerup

### Drag Cycle
1. User grabs card
2. Create floating mirror element
3. Move with transform
4. Hit-test columns & insertion point
5. Show placeholder
6. Commit move on drop
7. Emit events

---

# 4. Public API

---

# 4.1 Constructor

```js
const kb = new SaharosKanban(container, options)
```

---

# 4.2 Options

```ts
interface SaharosKanbanOptions {
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

  drag?: {
    handleSelector?: string | null;
    mirrorClass?: string;
    hoverClassColumn?: string;
    hoverClassCardPlaceholder?: string;
    pointerTolerance?: number;
  };

  columnRules?: {
    [columnId: string]: ColumnRule;
  };

  renderCard?: RenderCardHook;
  renderColumnHeader?: RenderColumnHeaderHook;
  renderLaneHeader?: RenderLaneHeaderHook;

  a11y?: {
    enabled?: boolean;
    boardLabel?: string;
    columnLabel?: (col: Column) => string;
    cardLabel?: (card: Card) => string;
  };

  on?: Partial<SaharosEventHandlers>;
  plugins?: SaharosKanbanPlugin[];

  debug?: boolean;
}
```

---

# 4.3 Data Types

```ts
type ID = string | number;

interface Lane {
  id: ID;
  title: string;
  order?: number;
  meta?: any;
}

interface Column {
  id: ID;
  title: string;
  laneId?: ID | null;
  order?: number;
  meta?: any;
}

interface Card {
  id: ID;
  title: string;
  columnId: ID;
  laneId?: ID | null;
  description?: string;
  order?: number;
  labels?: string[];
  meta?: any;
}

interface KanbanState {
  lanes?: Lane[];
  columns: Column[];
  cards: Card[];
}
```

---

# 4.4 Methods

## State

```ts
getState(): KanbanState;
loadState(state: KanbanState, opts?: { silent?: boolean }): void;
refresh(): void;
destroy(): void;
setOptions(patch: Partial<SaharosKanbanOptions>): void;
```

## Columns

```ts
addColumn(col: Column, opts?: { index?: number }): Column;
updateColumn(colId: ID, patch: Partial<Column>): Column | null;
removeColumn(colId: ID): boolean;
moveColumn(colId: ID, toIndex: number): boolean;
```

## Lanes

```ts
addLane(lane: Lane, opts?: { index?: number }): Lane;
updateLane(laneId: ID, patch: Partial<Lane>): Lane | null;
removeLane(laneId: ID): boolean;
moveLane(laneId: ID, toIndex: number): boolean;
```

## Cards

```ts
addCard(card: Omit<Card, 'order'>, opts?: { index?: number }): Card;
updateCard(cardId: ID, patch: Partial<Card>): Card | null;
removeCard(cardId: ID): boolean;

moveCard(
  cardId: ID,
  to: { columnId: ID; laneId?: ID | null; index?: number },
  opts?: { cause?: 'api' | 'pointer' | 'keyboard' }
): boolean;

scrollToCard(cardId: ID, opts?: ScrollIntoViewOptions): void;
```

---

# 4.5 Events

Event API:

```ts
kb.on(event, handler)
kb.off(event, handler)
kb.once(event, handler)
```

## Event List

### Lifecycle
- board:ready  
- board:destroy  

### State
- state:change  

### Columns
- column:add  
- column:update  
- column:remove  
- column:move  

### Lanes
- lane:add  
- lane:update  
- lane:remove  
- lane:move  

### Cards
- card:add  
- card:update  
- card:remove  

### Interactions
- card:click  
- card:dblclick  

### Drag
- card:drag:start  
- card:drag:over  
- card:drag:end  
- card:drag:cancel  

### Keyboard
- a11y:focus:card  
- a11y:move:card  

---

# 5. Rendering System

## Render Helpers

```ts
interface RenderHelpers {
  createElement(tag: string, className?: string): HTMLElement;
  defaultCardRenderer(card: Card): HTMLElement;
  defaultColumnHeaderRenderer(col: Column): HTMLElement;
  defaultLaneHeaderRenderer(lane: Lane): HTMLElement;
}
```

## Hooks

```ts
type RenderCardHook = (card: Card, helpers: RenderHelpers) => HTMLElement;
type RenderColumnHeaderHook = (col: Column, helpers: RenderHelpers) => HTMLElement;
type RenderLaneHeaderHook = (lane: Lane, helpers: RenderHelpers) => HTMLElement;
```

---

# 6. Plugin System

```ts
type SaharosKanbanPlugin = (ctx: PluginContext) => void;

interface PluginContext {
  board: SaharosKanban;
  getState: () => KanbanState;
  setState: (state: KanbanState, opts?: { silent?: boolean }) => void;
  on: typeof board.on;
  off: typeof board.off;
  emit: typeof board.emit;
  options: SaharosKanbanOptions;
}
```

### Example Plugin: WIP Limit

```js
export function wipLimitPlugin({ defaultLimit = 4 } = {}) {
  return (ctx) => {
    ctx.on('card:add', ({ column }) => {
      const state = ctx.getState();
      const count = state.cards.filter(c => c.columnId === column.id).length;
      const limit = ctx.options.columnRules?.[column.id]?.maxCards ?? defaultLimit;

      if (count > limit) {
        console.warn(`Column "${column.title}" exceeds WIP limit (${limit})`);
      }
    });
  };
}
```

---

# 7. Accessibility (A11Y)

- `role="list"` for columns  
- `role="listitem"` for cards  
- Arrow keys navigate  
- Space/Enter pick & drop card  
- ARIA labels via `a11y` options  

---

# 8. CSS & Theming

CSS variables:

```
--sk-board-bg
--sk-column-bg
--sk-card-bg
--sk-radius
--sk-spacing
--sk-border
```

Override example:

```css
#board {
  --sk-card-bg: #fffbea;
  --sk-radius: 8px;
}
```

---

# 9. Engineering Rules

1. Never add dependencies  
2. Never re-render entire board  
3. All mutations emit events  
4. TS internally, JS output  
5. Minimal DOM  
6. Drag & drop must feel native  
7. Maintain performance  
8. Ensure A11Y at all times  

---

# 10. Build & Distribution

Outputs:

- `saharos-kanban.esm.js`
- `saharos-kanban.umd.js`
- `saharos-kanban.css`

Use: Vite or Rollup

---

# 11. Examples

Basic:

```js
const kb = new SaharosKanban('#board', {
  columns: [
    { id: 'todo', title: 'To do' },
    { id: 'doing', title: 'Doing' },
    { id: 'done', title: 'Done' }
  ],
  cards: [
    { id: 1, title: 'Task A', columnId: 'todo' },
    { id: 2, title: 'Task B', columnId: 'doing' }
  ]
});
```

---

# 12. AI Agent Instructions

This is crucial.

### Agent Role
You are a senior engineer working on **Saharos-Kanban**.

### Agent Must:
1. Follow this file strictly  
2. Never introduce dependencies  
3. Use TS internally  
4. Maintain architecture  
5. Provide:  
   - Plan  
   - Design  
   - Code  
   - Tests  
   - Example updates  

---

# 13. Example AI Commands

### Initialize Project
> Create folder structure, Vite config, TS setup, ESLint, and SaharosKanban skeleton.

### Implement Drag & Drop
> Add pointer-based drag engine, commit state, and emit events.

### Add Custom Render Hooks
> Implement all three render hooks and update DOM logic.

### Create Plugin System
> Implement plugin engine and add WIP example plugin.

---

# 14. License

MIT

---

# 15. Final Notes

This document **IS THE BRAIN OF THE PROJECT**.  
All contributors—humans or AI—must follow it exactly.

