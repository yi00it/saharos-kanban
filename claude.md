# Claude Context - Saharos Kanban Project

## Project Overview
Saharos-Kanban is a high-quality, world-class **Vanilla JavaScript** Kanban board plugin that is framework-agnostic, fully dependency-free, and production-ready.

## Key Project Files
- **saharos-kanban.md** - Master specification, roadmap, API & engineering instructions (THE PROJECT BRAIN)
- **claude.md** - This file - context for AI assistance sessions

## Current Status
- **Version**: 1.0.0 🎉
- **Status**: PRODUCTION READY
- **License**: MIT

### Completed Milestones
1. ✅ **Milestone 1** (v0.1.0) - Foundation
2. ✅ **Milestone 2** (v0.2.0) - Drag & Drop
3. ✅ **Milestone 3** (v0.3.0) - Full API & LocalStorage
4. ✅ **Milestone 4** (v0.4.0) - Custom Rendering & Enhanced Theming
5. ✅ **Milestone 5** (v0.5.0) - Accessibility & Mobile Support
6. ✅ **Milestone 6** (v0.6.0) - Plugin System
7. ✅ **Milestone 7** (v1.0.0) - Production Release

## Engineering Rules (CRITICAL)
1. **NEVER** add dependencies - this is a zero-dependency library
2. **NEVER** re-render entire board - only update changed DOM elements
3. All mutations **MUST** emit events
4. Use TypeScript internally, output JavaScript
5. Maintain minimal DOM footprint
6. Drag & drop must feel native (using Pointer Events API)
7. Maintain high performance at all times
8. Ensure accessibility (A11Y) at all times

## Architecture Principles
1. **State is single source of truth** - All DOM reflects canonical JS state
2. **Events drive everything** - Every operation emits consistent events
3. **Rendering is modular** - Core renders simple HTML; apps override via hooks
4. **Plugins extend behavior** - Plugins get access to state, events, board instance
5. **Minimal DOM updates** - Surgical updates only

## Development Milestones

### Milestone 1 — Foundation (v0.1.0)
- Setup repo & folder structure
- Vite/Rollup library build
- ESLint + Prettier
- TS internal, JS output
- Basic DOM rendering: lanes → columns → cards
- Core CSS theme
- Basic example page

### Milestone 2 — Drag & Drop (v0.2.0)
- Pointer-based drag engine
- Reordering inside column
- Moving cards cross-columns
- Hit-testing system
- Hover feedback & placeholders
- `drag:start`, `drag:over`, `drag:end` events

### Milestone 3 — Full API (v0.3.0)
- CRUD methods for Cards, Columns, Lanes
- State manager
- `getState()`, `loadState()`
- LocalStorage autosave
- Full event bus

### Milestone 4 — Custom Rendering (v0.4.0)
- Render hooks: `renderCard`, `renderColumnHeader`, `renderLaneHeader`
- Templates & helper renderers
- Example: custom card layout
- Theme support with CSS variables

### Milestone 5 — Accessibility & Mobile (v0.5.0)
- Keyboard navigation
- ARIA roles
- Focus system
- Touch support

### Milestone 6 — Plugin System (v0.6.0)
- `use(plugin)` method
- Plugin context API
- Example plugins: WIP limits, Card aging, Column collapsing

### Milestone 7 — v1.0.0 Release
- Documentation website
- Multiple themes
- CDN builds
- Full examples gallery
- Test suite & GitHub Actions
- Publish to npm + versioning

## Tech Stack
- **Language**: TypeScript (internal) → JavaScript (output)
- **Build Tool**: Vite or Rollup
- **Drag & Drop**: Pointer Events API (pointerdown, pointermove, pointerup)
- **Testing**: To be determined (unit + e2e)
- **CSS**: CSS Variables for theming
- **Module Formats**: ESM & UMD

## Folder Structure
```
saharos-kanban/
├── src/
│   ├── core/
│   │   ├── Kanban.ts          # Main class
│   │   ├── state.ts           # State management
│   │   ├── dnd.ts             # Drag & drop engine
│   │   ├── events.ts          # Event bus
│   │   ├── plugins.ts         # Plugin system
│   ├── dom/
│   │   ├── render.ts          # DOM rendering
│   │   ├── templates/         # HTML templates
│   │   └── a11y.ts            # Accessibility
│   ├── styles/
│   │   └── index.css          # Core styles
│   └── index.ts               # Main entry point
├── dist/                       # Build output
├── examples/
│   ├── basic.html
│   ├── custom-render.html
│   ├── plugin-wip.html
├── tests/
│   ├── unit/
│   └── e2e/
├── saharos-kanban.md          # Master spec
├── claude.md                  # This file
└── README.md
```

## Core Data Types
```typescript
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

## Build Outputs
- `saharos-kanban.esm.js` - ES Module build
- `saharos-kanban.umd.js` - UMD build
- `saharos-kanban.css` - Styles

## Key Implementation Notes

### Drag & Drop Cycle
1. User grabs card (pointerdown)
2. Create floating mirror element
3. Move with transform (pointermove)
4. Hit-test columns & insertion point
5. Show placeholder
6. Commit move on drop (pointerup)
7. Emit events

### Event System
All events follow this pattern:
- Lifecycle: `board:ready`, `board:destroy`
- State: `state:change`
- CRUD: `column:add`, `column:update`, `column:remove`, `column:move`
- Same for lanes and cards
- Interactions: `card:click`, `card:dblclick`
- Drag: `card:drag:start`, `card:drag:over`, `card:drag:end`, `card:drag:cancel`
- A11Y: `a11y:focus:card`, `a11y:move:card`

### CSS Theming
Enhanced with 50+ CSS variables for comprehensive customization:
- **Colors**: Board, column, card, lane, text, borders, accents, drag states
- **Typography**: Font family, sizes (xs to xl), weights, line heights
- **Spacing**: Scale from xs (4px) to 2xl (32px)
- **Shadows**: Base, hover, active states
- **Border Radius**: sm, md, lg, xl options
- **Dimensions**: Column widths, card heights, gaps
- **Transitions**: Fast, normal, slow speeds
- **Z-index**: Layering system for modals, dropdowns, drag mirrors

## Development Workflow
1. Always read saharos-kanban.md first
2. Follow milestones in order
3. Implement features according to spec
4. Never deviate from architecture principles
5. Provide: Plan → Design → Code → Tests → Examples
6. Update todo list as work progresses

## Questions to Ask User
- Which milestone to start with?
- Any specific features to prioritize?
- Preferences for testing framework?
- Any custom requirements beyond spec?

## Important Reminders
- This is a LIBRARY, not an application
- Must work in ANY framework or no framework
- Performance is critical - this will handle large boards
- Accessibility is not optional - build it in from the start
- The spec (saharos-kanban.md) is the ultimate authority
