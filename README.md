# Saharos Kanban

[![npm version](https://img.shields.io/npm/v/saharos-kanban.svg?style=flat-square)](https://www.npmjs.com/package/saharos-kanban)
[![npm downloads](https://img.shields.io/npm/dm/saharos-kanban.svg?style=flat-square)](https://www.npmjs.com/package/saharos-kanban)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-green.svg?style=flat-square)](package.json)

A high-quality, world-class **Vanilla JavaScript** Kanban board plugin that is framework-agnostic, fully dependency-free, and production-ready.

## 🎉 Production Ready - v1.0.0

### Complete Feature Set

#### Milestone 7 - v1.0.0 Production Release (NEW!)
- ✅ **Multiple Themes**
  - Dark theme (`theme-dark.css`) - Modern dark color scheme
  - Light theme (`theme-light.css`) - Refined light colors
  - Colorful theme (`theme-colorful.css`) - Vibrant gradients
  - Easy theme switching via CSS classes

- ✅ **Examples Gallery** (`examples/index.html`)
  - Beautiful showcase page
  - All examples in one place
  - Interactive cards with descriptions
  - Mobile-responsive design

- ✅ **Production Documentation**
  - Comprehensive CHANGELOG.md
  - MIT License
  - npm-ready package.json
  - Complete API documentation

#### Milestone 6 - Plugin System
- ✅ **Plugin Architecture** (`src/core/plugins.ts`)
  - `use(plugin)` method for registering plugins
  - PluginContext API with full board access
  - Event subscription and emission
  - State management (getState, setState)
  - Options access for configuration

- ✅ **WIP Limit Plugin**
  - Visual indicators for work-in-progress limits
  - Configurable limits via column metadata
  - Warning animations when limits exceeded
  - Counter display (e.g., "3/3", "4/3")
  - Color-coded states (normal, at-limit, exceeded)
  - Custom callbacks on limit violations

- ✅ **Card Aging Plugin**
  - Tracks time cards spend in columns
  - Configurable warning/danger thresholds (default: 3/7 days)
  - Visual indicators (orange/red borders)
  - Age display on cards
  - Automatic timestamp updates on moves
  - Customizable age tracking field

- ✅ **Column Collapse Plugin**
  - Toggle buttons in column headers
  - Smooth collapse/expand animations
  - LocalStorage persistence
  - Customizable classes and storage keys
  - Space-saving for large boards

- ✅ **Plugin Utilities**
  - `addPluginStyles()` - Dynamic CSS injection
  - `debounce()` - Debounce function calls
  - `throttle()` - Throttle function calls
  - Full TypeScript support

- ✅ **Plugin Demo** (`examples/plugins.html`)
  - All 3 plugins working together
  - Interactive controls
  - Visual legend
  - Real-world usage examples

#### Milestone 5 - Accessibility & Mobile
- ✅ **Keyboard Navigation** (`src/dom/a11y.ts`)
  - Arrow keys to navigate between cards and columns
  - Space/Enter to pick up and drop cards
  - Escape to cancel card moves
  - Home/End to jump to first/last card
  - Tab navigation support
  - Full keyboard-only operation

- ✅ **ARIA Support**
  - Proper ARIA roles (`role="list"`, `role="listitem"`, `role="region"`)
  - ARIA labels for cards, columns, and board
  - ARIA attributes (`aria-grabbed`, `aria-label`, `aria-describedby`)
  - Screen reader optimized
  - Configurable labels via `a11y` options

- ✅ **Focus Management**
  - Visible focus indicators with high contrast
  - Focus tracking across navigation
  - Visual feedback for picked cards
  - `:focus-visible` support
  - Focus restoration after moves

- ✅ **Touch & Mobile Support**
  - Native touch event handling via Pointer Events
  - `touch-action` CSS for proper scroll behavior
  - Larger touch targets on mobile devices (`@media (pointer: coarse)`)
  - Mobile-optimized responsive design
  - Tap highlight removal for better UX

- ✅ **Accessibility Events**
  - `a11y:focus:card` - When card receives focus
  - `a11y:move:card` - When card moved via keyboard

- ✅ **A11y Demo** (`examples/a11y.html`)
  - Complete keyboard navigation showcase
  - Event logging for a11y events
  - Keyboard shortcuts guide
  - Mobile-friendly responsive layout

#### Milestone 4 - Custom Rendering
- ✅ **Enhanced CSS Variables** (`src/styles/index.css`)
  - Comprehensive theming system with 50+ CSS variables
  - Typography variables (font sizes, weights, line heights)
  - Color system (board, column, card, lane, text, borders)
  - Spacing scale (xs to 2xl)
  - Shadow system (base, hover, active)
  - Border radius options
  - Drag & drop visual customization
  - Z-index management
  - Transition speeds
  
- ✅ **Custom Rendering System**
  - `renderCard` hook - Full control over card rendering
  - `renderColumnHeader` hook - Custom column headers
  - `renderLaneHeader` hook - Custom lane headers
  - RenderHelpers utility (`createElement`, `escapeHtml`, `addClass`, etc.)
  - Default renderers with extensibility
  - Support for custom metadata on cards, columns, and lanes
  
- ✅ **Advanced Example** (`examples/custom-render.html`)
  - Rich card rendering with avatars, priorities, due dates
  - WIP (Work In Progress) limits on columns
  - Live card counting per column
  - Team metadata on lanes (size, velocity)
  - Due date formatting with smart labels
  - Priority indicators (high/medium/low)
  - Comment and attachment counts
  - Visual warnings for WIP limit violations

#### Milestone 3 - Full API
- ✅ **Complete CRUD Operations** (`src/core/Kanban.ts`)
  - Card operations: `addCard()`, `updateCard()`, `removeCard()`, `moveCard()`, `scrollToCard()`
  - Column operations: `addColumn()`, `updateColumn()`, `removeColumn()`, `moveColumn()`
  - Lane operations: `addLane()`, `updateLane()`, `removeLane()`, `moveLane()`
  - All methods emit proper events
  
- ✅ **LocalStorage Integration** (`src/core/storage.ts`)
  - Automatic state persistence
  - Configurable storage key
  - Load state from storage on init
  - Auto-save on state changes
  - `clearStorage()` method
  
- ✅ **API Demo** (`examples/api-demo.html`)
  - Interactive controls for all CRUD operations
  - Live state inspection
  - Storage management

#### Milestone 2 - Drag & Drop
- ✅ **Drag and Drop Engine** (`src/core/dnd.ts`)
  - Pointer Events API-based implementation
  - Drag mirror element with visual feedback
  - Hit-testing system for accurate drop detection
  - Placeholder system for insertion preview
  - Card reordering within same column
  - Card moving across columns
  - Drag tolerance to prevent accidental drags
  - Full event emission (`drag:start`, `drag:over`, `drag:end`, `drag:cancel`)
  - Support for drag handles
  - Configurable drag options
  - Readonly and draggable mode support

#### Milestone 1 - Foundation

#### Project Setup & Configuration
- ✅ Complete folder structure (`src/`, `dist/`, `examples/`, `tests/`)
- ✅ Package.json with proper metadata
- ✅ TypeScript configuration (tsconfig.json)
- ✅ Vite build configuration for library mode (ESM + UMD)
- ✅ ESLint configuration with TypeScript support
- ✅ Prettier configuration for code formatting
- ✅ .gitignore file

#### Core Architecture
- ✅ **Type Definitions** (`src/core/types.ts`)
  - Complete TypeScript definitions for Lane, Column, Card, KanbanState
  - Event types and handlers
  - Plugin system interfaces
  - Render hook types
  
- ✅ **Event Bus** (`src/core/events.ts`)
  - Zero-dependency event emitter
  - Support for `on`, `off`, `once`, `emit`
  - Debug mode for development
  
- ✅ **State Management** (`src/core/state.ts`)
  - Single source of truth for board state
  - CRUD operations for lanes, columns, and cards
  - Automatic ordering and normalization
  - Efficient state queries with filtering
  
- ✅ **Main Kanban Class** (`src/core/Kanban.ts`)
  - Core board initialization
  - State management integration
  - Event bus integration
  - Plugin support
  - Options handling

#### DOM Rendering
- ✅ **Render System** (`src/dom/render.ts`)
  - Default renderers for cards, columns, and lanes
  - Support for custom render hooks
  - Render helpers for extensibility
  - Lane-based and simple column layouts

#### Styling
- ✅ **Core CSS** (`src/styles/index.css`)
  - Complete CSS with CSS variables for theming
  - Responsive design
  - Clean, modern aesthetics
  - Hover effects and transitions
  - Drag state styling with hover effects
  - Mirror element styling
  - Placeholder styles

#### Examples
- ✅ **Basic Example** (`examples/basic.html`)
  - Functional demo with sample data
  - Interactive drag and drop
  - Event logging in console
  - Interactive controls (refresh, log state, add cards)
  - Clean UI design
  
- ✅ **API Demo** (`examples/api-demo.html`)
  - Complete CRUD operations showcase
  - Storage management
  - Live state inspection
  
- ✅ **Custom Rendering** (`examples/custom-render.html`)
  - Advanced card rendering with metadata
  - WIP limits on columns
  - Team lanes with velocity tracking
  - Priority and due date visualization

- ✅ **Accessibility Demo** (`examples/a11y.html`)
  - Full keyboard navigation
  - ARIA support demonstration
  - Event logging
  - Mobile-friendly interface
  - Keyboard shortcuts guide

- ✅ **Plugin System Demo** (`examples/plugins.html`)
  - WIP limit enforcement
  - Card aging visualization
  - Column collapsing
  - All 3 plugins working together
  - Interactive testing controls

## Features

### Production Features (v1.0.0)
- 🎨 **Multiple Themes** - Dark, Light, and Colorful themes included
- 🔌 **Plugin System** - Extensible architecture with `use(plugin)` API
- 📦 **Official Plugins** - WIP limits, card aging, column collapsing
- ♿ **Full Accessibility** - Complete keyboard navigation, ARIA support, screen reader friendly
- 📱 **Mobile Optimized** - Touch gestures, responsive design, larger touch targets
- ⌨️ **Keyboard Navigation** - Arrow keys, Space/Enter, Home/End, Escape
- 🖼️ **Custom Rendering** - Full control over card, column, and lane rendering
- 🔧 **Advanced Theming** - 50+ CSS variables for complete customization
- 🔨 **Full CRUD API** - Add, update, remove, and move cards/columns/lanes
- 💾 **LocalStorage** - Automatic state persistence
- 🖱️ **Full Drag & Drop** - Native pointer-based dragging
- 🎯 **Zero dependencies** - Completely standalone
- 🏗️ **Framework-agnostic** - Works with any JS framework or vanilla JS
- 📘 **TypeScript support** - Full type definitions included
- 🎪 **Event-driven architecture** - Rich event system
- 🧩 **Modular codebase** - Clean, maintainable structure
- 📦 **ESM and UMD builds** - Use anywhere
- ⚡ **High performance** - Optimized for large boards
- 🎛️ **Highly configurable** - Extensive customization options
- 📚 **Comprehensive docs** - Examples, API docs, and CHANGELOG

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

⚠️ **IMPORTANT:** Your custom `renderCard` function **must** return an element with:
- **Class:** `.sk-card` (required for drag & drop functionality)
- **Attribute:** `data-card-id="${card.id}"` (required for card identification)

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

## Engineering Principles

1. **Zero dependencies** - No external libraries
2. **Never re-render entire board** - Surgical DOM updates only
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
    id: string,               // Source column ID (e.g., 'todo')
    title: string,            // Source column title (e.g., 'To Do')
    laneId?: string | null,   // Source lane ID
    order?: number,           // Column order
    meta?: object             // Source column metadata
  },
  to: {
    id: string,               // Target column ID (e.g., 'in-progress')
    title: string,            // Target column title (e.g., 'In Progress')
    laneId?: string | null,   // Target lane ID
    order?: number,           // Column order
    meta?: object             // Target column metadata
  }
}
```

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

For more help, check the [examples](./examples/) or [open an issue](https://github.com/saharos/saharos-kanban/issues).

## License

MIT

## Contributing

Contributions are welcome! This project follows the master specification in `saharos-kanban.md`.

## Roadmap

See `saharos-kanban.md` for the complete roadmap and technical specification.

---

**Current Version:** 1.0.0 🎉  
**Status:** Production Ready  
**License:** MIT
