# 🎯 Saharos Kanban

[![npm version](https://img.shields.io/npm/v/saharos-kanban.svg?style=flat-square)](https://www.npmjs.com/package/saharos-kanban)
[![npm downloads](https://img.shields.io/npm/dm/saharos-kanban.svg?style=flat-square)](https://www.npmjs.com/package/saharos-kanban)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-green.svg?style=flat-square)](package.json)
[![Bundle Size](https://img.shields.io/badge/gzip-12.5KB-success?style=flat-square)](https://bundlephobia.com/package/saharos-kanban)

A modern, lightweight Kanban board library built with vanilla TypeScript. Zero dependencies, fully accessible, and faster than alternatives.

```bash
npm install saharos-kanban
```

## ✨ Why Saharos Kanban?

### 🚀 Better Performance
Benchmarked against jKanban with 1000 cards:
- **100% faster** initialization
- **0.8% fewer** DOM nodes (1,013 vs 1,021)
- **0.8% smaller** HTML output (74KB vs 75KB)
- **Incremental rendering** - only updates what changed (v1.1.2+)

### 🎨 More Features
- **Full keyboard navigation** (Arrow keys, Space/Enter, Esc)
- **Complete ARIA support** for screen readers
- **Plugin system** (WIP limits, card aging, column collapse)
- **Multiple themes** (Dark, Light, Colorful)
- **Custom rendering** hooks for cards, columns, and lanes
- **LocalStorage** persistence out of the box
- **Touch & mobile** optimized

### 📦 Zero Dependencies
- **12.5KB gzipped** (66.9KB ESM)
- Works with React, Vue, Angular, or vanilla JS
- Full TypeScript support with types included
- ESM and UMD builds

## 📸 Screenshots

![Saharos Kanban Demo](https://via.placeholder.com/800x450/1e293b/e5e7eb?text=Saharos+Kanban+Demo)

> **Live Examples:** Check out the `/examples` folder for interactive demos:
> - `basic.html` - Simple drag & drop board
> - `custom-render.html` - Rich cards with avatars, priorities, due dates
> - `plugins.html` - WIP limits, card aging, column collapse
> - `a11y.html` - Keyboard navigation & accessibility
> - `api-demo.html` - Full CRUD operations

## ⚡ Features at a Glance

| Feature | Saharos Kanban | jKanban | Comparison |
|---------|---------------|---------|------------|
| **Bundle Size** | 12.5KB gzipped | ~15KB | ✅ 16% smaller |
| **TypeScript** | ✅ Full support | ❌ None | ✅ Better DX |
| **Accessibility** | ✅ Full ARIA + Keyboard | ❌ None | ✅ WCAG compliant |
| **Plugin System** | ✅ Built-in | ❌ None | ✅ Extensible |
| **Custom Rendering** | ✅ Full hooks | ⚠️ Limited | ✅ More flexible |
| **Performance (1000 cards)** | 100% faster init | Baseline | ✅ 2x faster |
| **Dependencies** | 0 | 0 | ✅ Both clean |
| **Themes** | 3 built-in | 0 | ✅ Ready to use |
| **LocalStorage** | ✅ Built-in | ❌ None | ✅ Persistence included |
| **Mobile/Touch** | ✅ Optimized | ⚠️ Basic | ✅ Better UX |

## 🚀 Quick Start

### Installation

```bash
# npm
npm install saharos-kanban

# yarn
yarn add saharos-kanban

# pnpm
pnpm add saharos-kanban
```

### Basic Usage

```javascript
import { SaharosKanban } from 'saharos-kanban';
import 'saharos-kanban/dist/saharos-kanban.css';

const board = new SaharosKanban('#board', {
  columns: [
    { id: 'todo', title: 'To Do' },
    { id: 'doing', title: 'Doing' },
    { id: 'done', title: 'Done' }
  ],
  cards: [
    { id: 1, title: 'Task A', columnId: 'todo' },
    { id: 2, title: 'Task B', columnId: 'doing' }
  ]
});
```

### With Themes

```javascript
import { SaharosKanban } from 'saharos-kanban';
import 'saharos-kanban/dist/saharos-kanban.css';
// Import a theme
import 'saharos-kanban/dist/theme-dark.css';

// Add theme class to your container
document.querySelector('#board').classList.add('sk-theme-dark');

const board = new SaharosKanban('#board', { /* ... */ });
```

### With Plugins

```javascript
import { SaharosKanban, wipLimitPlugin, cardAgingPlugin } from 'saharos-kanban';

const board = new SaharosKanban('#board', {
  columns: [
    { id: 'doing', title: 'Doing', meta: { wipLimit: 3 } }
  ],
  plugins: [
    wipLimitPlugin(),
    cardAgingPlugin({ days: { warning: 3, danger: 7 } })
  ]
});
```

### With Events

```javascript
const board = new SaharosKanban('#board', {
  columns: [...],
  cards: [...],
  on: {
    'board:ready': () => {
      console.log('Board is ready!');
    },
    'state:change': ({ state }) => {
      console.log('State changed:', state);
    },
    'card:drag:end': ({ card, from, to }) => {
      console.log(`Moved "${card.title}" from ${from.title} to ${to.title}`);
    }
  }
});
```

### Custom Rendering

When providing custom render functions, you **must** include specific classes and attributes for the library to work correctly.

#### Custom Card Rendering

⚠️ **REQUIRED ATTRIBUTES:** When using custom `renderCard()`, you **MUST** include:
- **Class:** `.sk-card` (required for drag functionality)
- **Attribute:** `data-card-id="${card.id}"` (required for identification)

Without these, drag & drop will not work.

**Example:**
```javascript
const board = new SaharosKanban('#board', {
  renderCard: (card, helpers) => {
    const el = helpers.createElement('div');
    
    // REQUIRED: Add .sk-card class
    el.className = 'sk-card my-custom-class';
    
    // REQUIRED: Add data-card-id attribute
    el.dataset.cardId = String(card.id);
    
    // Your custom content
    el.innerHTML = `
      <div class="custom-card-header">
        <h3>${helpers.escapeHtml(card.title)}</h3>
      </div>
      <div class="custom-card-body">
        ${helpers.escapeHtml(card.description || '')}
      </div>
    `;
    
    return el;
  }
});
```

#### Custom Column Header Rendering

When providing a custom `renderColumnHeader`, include:
- **Attribute:** `data-column-id="${column.id}"` (automatically added by the library)

**Example:**
```javascript
renderColumnHeader: (column, helpers) => {
  const el = helpers.createElement('div', 'sk-column-header');
  el.innerHTML = `
    <h2>${helpers.escapeHtml(column.title)}</h2>
    <span class="card-count">${cardCount}</span>
  `;
  return el;
}
```

#### Custom Lane Header Rendering

**Example:**
```javascript
renderLaneHeader: (lane, helpers) => {
  const el = helpers.createElement('div', 'sk-lane-header');
  el.innerHTML = `
    <h1>${helpers.escapeHtml(lane.title)}</h1>
  `;
  return el;
}
```

#### RenderHelpers API

The `helpers` object passed to render functions provides:
- `createElement(tag, className?)` - Create element with optional class
- `escapeHtml(str)` - Escape HTML to prevent XSS
- `addClass(el, ...classes)` - Add classes to element
- `removeClass(el, ...classes)` - Remove classes from element
- `defaultCardRenderer(card)` - Default card renderer
- `defaultColumnHeaderRenderer(column)` - Default column header
- `defaultLaneHeaderRenderer(lane)` - Default lane header

**See `examples/custom-render.html` for a complete working example.**

## Development

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build library
npm run build

# Lint code
npm run lint
npm run lint:fix

# Format code
npm run format
npm run format:check
```

### Project Structure

```
saharos-kanban/
├── src/
│   ├── core/
│   │   ├── Kanban.ts          # Main class
│   │   ├── types.ts           # TypeScript definitions
│   │   ├── state.ts           # State management
│   │   ├── events.ts          # Event bus
│   │   └── plugins.ts         # Plugin system (M6)
│   ├── dom/
│   │   ├── render.ts          # DOM rendering
│   │   ├── templates/         # HTML templates
│   │   └── a11y.ts            # Accessibility (M5)
│   ├── styles/
│   │   └── index.css          # Core styles
│   └── index.ts               # Main entry point
├── dist/                       # Build output
├── examples/
│   ├── basic.html
│   ├── custom-render.html     # (M4)
│   └── plugin-wip.html        # (M6)
├── tests/
│   ├── unit/
│   └── e2e/
└── README.md
```

## 📊 Performance Benchmarks

Tested against jKanban v1.3.1 with 1000 cards (4 columns, 250 cards each):

```
┌─────────────────┬──────────────┬──────────────┬────────────┐
│ Metric          │ jKanban      │ saharos      │ Winner     │
├─────────────────┼──────────────┼──────────────┼────────────┤
│ Init (ms)       │ 5.0          │ 2.5          │ saharos ✓  │
│ DOM nodes       │ 1,021        │ 1,013        │ saharos ✓  │
│ HTML size       │ 75,247       │ 74,654       │ saharos ✓  │
└─────────────────┴──────────────┴──────────────┴────────────┘
```

**Key Optimizations (v1.1.2):**
- ✅ **Incremental DOM updates** - Only re-renders changed cards, not the entire board
- ✅ **RAF debouncing** - Batches multiple updates into single render cycle
- ✅ **Singleton render helpers** - Reuses helper instances across renders
- ✅ **Minimal DOM structure** - Conditional wrappers only when needed
- ✅ **Smart accessibility** - Only enhances affected elements on updates

> Run `tests/benchmark.html` locally to compare on your machine

## Engineering Principles

1. **Zero dependencies** - No external libraries
2. **Incremental rendering** - Surgical DOM updates only (v1.1.2+)
3. **All mutations emit events** - Consistent event system
4. **TypeScript internally, JavaScript output** - Best of both worlds
5. **Minimal DOM footprint** - Performance-focused
6. **Native drag & drop** - Using Pointer Events API
7. **Maintain high performance** - Optimized for large boards
8. **Accessibility first** - ARIA support from the ground up

## API Documentation

### Constructor

```typescript
new SaharosKanban(container: string | HTMLElement, options?: SaharosKanbanOptions)
```

### Methods

- `getState(): KanbanState` - Get current board state
- `loadState(state: KanbanState, opts?)` - Load new state
- `refresh()` - Re-render the board
- `on(event, handler)` - Subscribe to event
- `off(event, handler)` - Unsubscribe from event
- `once(event, handler)` - Subscribe once
- `use(plugin)` - Register plugin
- `setOptions(patch)` - Update options
- `destroy()` - Cleanup board

### Events

Saharos Kanban emits events for all board operations. Subscribe to events using the `on` option or `board.on()` method.

#### Complete Event List

**Board Lifecycle:**
- `board:ready` - Board initialized and ready
- `board:destroy` - Board destroyed and cleaned up
- `state:change` - State updated (fired after CRUD operations)

**Card Events:**
- `card:add` - Card added to board
- `card:update` - Card updated
- `card:remove` - Card removed from board
- `card:click` - Card clicked
- `card:dblclick` - Card double-clicked
- `card:drag:start` - Drag started
- `card:drag:over` - Dragging over a column
- `card:drag:end` - Drag completed (card dropped)
- `card:drag:cancel` - Drag cancelled

**Column Events:**
- `column:add` - Column added
- `column:update` - Column updated
- `column:remove` - Column removed
- `column:move` - Column reordered

**Lane Events:**
- `lane:add` - Lane added
- `lane:update` - Lane updated
- `lane:remove` - Lane removed
- `lane:move` - Lane reordered

**Accessibility Events:**
- `a11y:focus:card` - Card focused via keyboard
- `a11y:move:card` - Card moved via keyboard

#### Event Details: `card:drag:end`

Fired when a card is dropped in a new column. This is the most commonly used event for syncing with backends.

**Event Payload:**
```typescript
{
  card: {
    id: number | string,      // Card ID
    title: string,            // Card title
    columnId: string,         // NEW column ID (after move)
    laneId?: string | null,   // Lane ID (if using lanes)
    description?: string,     // Card description
    order?: number,           // Card order in column
    labels?: string[],        // Card labels
    meta?: object             // Custom metadata
  },
  from: {
    id: string,               // Source column ID (e.g., 'todo') ← Extract column ID from from.id
    title: string,            // Source column title (e.g., 'To Do')
    laneId?: string | null,   // Source lane ID
    order?: number,           // Column order
    meta?: object             // Source column metadata
  },
  to: {
    id: string,               // Target column ID (e.g., 'in-progress') ← Extract column ID from to.id
    title: string,            // Target column title (e.g., 'In Progress')
    laneId?: string | null,   // Target lane ID
    order?: number,           // Column order
    meta?: object             // Target column metadata
  }
}
```

**Important:** To get column IDs, use `from.id` and `to.id` (not `from.columnId`)

**Example Usage:**

```javascript
const board = new SaharosKanban('#board', {
  on: {
    'card:drag:end': ({ card, from, to }) => {
      console.log(`Card "${card.title}" moved from "${from.title}" to "${to.title}"`);
      
      // Update backend with new status
      fetch(`/api/cards/${card.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: to.id,           // ← New column ID
          previousStatus: from.id  // ← Old column ID
        })
      });
      
      // Show user notification
      showToast(`Card moved to ${to.title}`);
      
      // Analytics tracking
      analytics.track('card_moved', {
        cardId: card.id,
        fromColumn: from.id,
        toColumn: to.id
      });
    }
  }
});
```

**Common Patterns:**

```javascript
// Pattern 1: Backend sync
'card:drag:end': async ({ card, to }) => {
  await updateCardStatus(card.id, to.id);
}

// Pattern 2: Conditional logic based on column
'card:drag:end': ({ card, to }) => {
  if (to.id === 'done') {
    // Card marked as complete
    celebrateCompletion(card);
  }
}

// Pattern 3: Prevent certain moves (with undo)
'card:drag:end': ({ card, from, to }) => {
  if (to.id === 'archived' && !card.meta?.reviewed) {
    // Move back to original column
    board.moveCard(card.id, from.id);
    alert('Card must be reviewed before archiving');
  }
}

// Pattern 4: Update related data
'card:drag:end': ({ card, from, to }) => {
  // Update card metadata
  board.updateCard(card.id, {
    meta: {
      ...card.meta,
      movedAt: Date.now(),
      movedFrom: from.id,
      movedTo: to.id
    }
  });
}
```

#### Event Details: `a11y:move:card`

Similar to `card:drag:end`, but fired when cards are moved via keyboard navigation (Space/Enter).

```javascript
'a11y:move:card': ({ card, from, to }) => {
  // Same payload as card:drag:end
  console.log('Card moved via keyboard');
}
```

#### Subscribing to Events

**Option 1: During initialization**
```javascript
const board = new SaharosKanban('#board', {
  on: {
    'card:drag:end': (event) => { /* ... */ }
  }
});
```

**Option 2: After initialization**
```javascript
board.on('card:drag:end', (event) => {
  console.log('Card moved:', event);
});

// One-time subscription
board.once('board:ready', () => {
  console.log('Board ready!');
});

// Unsubscribe
const handler = (event) => console.log(event);
board.on('card:drag:end', handler);
board.off('card:drag:end', handler);
```

**See `examples/` folder for complete working examples of all events.**

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Modern mobile browsers

## Troubleshooting

### Drag & Drop Not Working with Custom Cards

**Problem:** Cards don't drag when using custom `renderCard` function.

**Solution:** Ensure your custom card element includes:
```javascript
// REQUIRED for drag & drop
element.className = 'sk-card'; // or 'sk-card your-custom-class'
element.dataset.cardId = String(card.id);
```

### Cards Not Updating After State Changes

**Problem:** Visual changes don't appear after calling CRUD methods.

**Solution:** The board auto-renders after CRUD operations. If you modify state directly:
```javascript
const state = board.getState();
state.cards[0].title = "New Title";
// Must call loadState to trigger re-render
board.loadState(state);
```

### TypeScript Errors with Custom Metadata

**Problem:** TypeScript complains about custom `meta` properties.

**Solution:** Extend the types:
```typescript
import type { Card } from 'saharos-kanban';

interface MyCard extends Card {
  meta?: {
    priority?: 'high' | 'medium' | 'low';
    dueDate?: string;
  };
}
```

### Keyboard Navigation Not Working

**Problem:** Arrow keys don't navigate between cards.

**Solution:** Ensure accessibility is enabled (it's on by default):
```javascript
const board = new SaharosKanban('#board', {
  a11y: {
    enabled: true  // Default: true
  }
});
```

### Plugin Not Running

**Problem:** Plugin code doesn't execute.

**Solution:** Plugins must be passed during initialization:
```javascript
// ✅ Correct
const board = new SaharosKanban('#board', {
  plugins: [myPlugin()]
});

// ❌ Wrong - too late
const board = new SaharosKanban('#board', {});
board.use(myPlugin()); // This works but after board:ready
```

### Performance Issues with Large Boards

**Problem:** Board is slow with 1000+ cards.

**Solution:** Consider:
- Enabling column collapsing plugin
- Implementing pagination or lazy loading
- Using virtual scrolling (future feature)
- Reducing render complexity in custom renderers

For more help, check the [examples](./examples/) or [open an issue](https://github.com/yi00it/saharos-kanban/issues).

## License

MIT

## Contributing

Contributions are welcome! This project follows the master specification in `saharos-kanban.md`.

## Roadmap

See `saharos-kanban.md` for the complete roadmap and technical specification.

---

**Current Version:** 1.1.2
**Status:** Production Ready
**License:** MIT

Made with ❤️ by the Saharos Team
