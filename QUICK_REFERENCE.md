# Saharos Kanban - Quick Reference Guide

## 🚀 Installation

```bash
npm install saharos-kanban
```

## 📦 Import

```javascript
import { SaharosKanban } from 'saharos-kanban';
import 'saharos-kanban/dist/saharos-kanban.css';

// Optional: Import a theme
import 'saharos-kanban/dist/theme-dark.css';

// Optional: Import plugins
import { wipLimitPlugin, cardAgingPlugin, columnCollapsePlugin } from 'saharos-kanban';
```

---

## 🎯 Basic Usage

```javascript
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

---

## 🔧 Configuration Options

```javascript
const board = new SaharosKanban('#board', {
  // Data
  lanes: [],           // Optional swimlanes
  columns: [],         // Required
  cards: [],           // Required
  
  // Behavior
  readonly: false,     // Disable all interactions
  draggable: true,     // Enable/disable drag & drop
  sortable: true,      // Enable/disable sorting
  
  // Storage
  storageKey: null,    // Enable LocalStorage with key
  
  // Accessibility
  a11y: {
    enabled: true,
    boardLabel: 'Kanban Board',
    columnLabel: (col) => col.title,
    cardLabel: (card) => card.title
  },
  
  // Events
  on: {
    'board:ready': () => {},
    'state:change': ({ state }) => {},
    'card:drag:end': ({ card, from, to }) => {}
  },
  
  // Plugins
  plugins: [
    wipLimitPlugin(),
    cardAgingPlugin()
  ],
  
  // Custom Rendering
  renderCard: (card, helpers) => { /* ... */ },
  renderColumnHeader: (col, helpers) => { /* ... */ },
  renderLaneHeader: (lane, helpers) => { /* ... */ }
});
```

---

## 📋 CRUD Methods

### Cards
```javascript
// Add
const card = board.addCard({
  id: 3,
  title: 'New Task',
  columnId: 'todo'
});

// Update
board.updateCard(1, { title: 'Updated Task' });

// Remove
board.removeCard(1);

// Move
board.moveCard(1, 'done'); // Move to column

// Scroll to
board.scrollToCard(1);
```

### Columns
```javascript
// Add
board.addColumn({ id: 'review', title: 'Review' });

// Update
board.updateColumn('todo', { title: 'Backlog' });

// Remove
board.removeColumn('done');

// Move
board.moveColumn('review', 2); // Move to index 2
```

### Lanes
```javascript
// Add
board.addLane({ id: 'team1', title: 'Team 1' });

// Update
board.updateLane('team1', { title: 'Frontend Team' });

// Remove
board.removeLane('team1');

// Move
board.moveLane('team1', 0); // Move to top
```

---

## 🎨 Custom Rendering

### ⚠️ IMPORTANT: Required Attributes

When creating custom renderers, you **MUST** include:

#### For Cards:
```javascript
renderCard: (card, helpers) => {
  const el = helpers.createElement('div');
  
  // REQUIRED: .sk-card class
  el.className = 'sk-card';
  
  // REQUIRED: data-card-id attribute
  el.dataset.cardId = String(card.id);
  
  // Your custom content
  el.innerHTML = `<h3>${helpers.escapeHtml(card.title)}</h3>`;
  
  return el;
}
```

#### For Columns:
```javascript
renderColumnHeader: (column, helpers) => {
  const el = helpers.createElement('div', 'sk-column-header');
  el.innerHTML = `<h2>${helpers.escapeHtml(column.title)}</h2>`;
  return el;
}
```

#### For Lanes:
```javascript
renderLaneHeader: (lane, helpers) => {
  const el = helpers.createElement('div', 'sk-lane-header');
  el.innerHTML = `<h1>${helpers.escapeHtml(lane.title)}</h1>`;
  return el;
}
```

### RenderHelpers
```javascript
helpers.createElement(tag, className?)
helpers.escapeHtml(str)
helpers.addClass(el, ...classes)
helpers.removeClass(el, ...classes)
helpers.defaultCardRenderer(card)
helpers.defaultColumnHeaderRenderer(column)
helpers.defaultLaneHeaderRenderer(lane)
```

---

## 🎭 Events

### Board Events
- `board:ready` - Board initialized
- `board:destroy` - Board destroyed
- `state:change` - State updated

### Card Events
- `card:add` - Card added
- `card:update` - Card updated
- `card:remove` - Card removed
- `card:click` - Card clicked
- `card:dblclick` - Card double-clicked
- `card:drag:start` - Drag started
- `card:drag:over` - Dragging over column
- `card:drag:end` - Drag completed
- `card:drag:cancel` - Drag cancelled

### Column Events
- `column:add` - Column added
- `column:update` - Column updated
- `column:remove` - Column removed
- `column:move` - Column moved

### Lane Events
- `lane:add` - Lane added
- `lane:update` - Lane updated
- `lane:remove` - Lane removed
- `lane:move` - Lane moved

### Accessibility Events
- `a11y:focus:card` - Card focused via keyboard
- `a11y:move:card` - Card moved via keyboard

### Most Used Event: `card:drag:end`

**Payload Structure:**
```javascript
{
  card: { id, title, columnId, meta, ... },
  from: { id, title, meta },  // Source column
  to: { id, title, meta }      // Target column
}
```

**Example - Backend Sync:**
```javascript
board.on('card:drag:end', ({ card, from, to }) => {
  // Update backend
  fetch(`/api/cards/${card.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: to.id })  // ← Use to.id
  });
  
  // Show notification
  showToast(`Moved to ${to.title}`);  // ← Use to.title
});
```

### Subscribe to Events
```javascript
// Option 1: During initialization
const board = new SaharosKanban('#board', {
  on: {
    'card:drag:end': ({ card, from, to }) => { /* ... */ }
  }
});

// Option 2: After initialization
board.on('card:drag:end', ({ card, from, to }) => {
  console.log(`Moved "${card.title}" from ${from.title} to ${to.title}`);
});

// One-time subscription
board.once('board:ready', () => {
  console.log('Board is ready!');
});

// Unsubscribe
const handler = () => console.log('Card moved');
board.on('card:drag:end', handler);
board.off('card:drag:end', handler);
```

---

## 🔌 Plugins

### WIP Limit Plugin
```javascript
import { wipLimitPlugin } from 'saharos-kanban';

const board = new SaharosKanban('#board', {
  columns: [
    { id: 'doing', title: 'Doing', meta: { wipLimit: 3 } }
  ],
  plugins: [
    wipLimitPlugin({
      showWarning: true,
      onLimitExceeded: (column, limit, current) => {
        console.warn(`WIP limit exceeded: ${current}/${limit}`);
      }
    })
  ]
});
```

### Card Aging Plugin
```javascript
import { cardAgingPlugin } from 'saharos-kanban';

const board = new SaharosKanban('#board', {
  plugins: [
    cardAgingPlugin({
      days: { warning: 3, danger: 7 },
      classes: { 
        warning: 'sk-card-aging-warning', 
        danger: 'sk-card-aging-danger' 
      }
    })
  ]
});
```

### Column Collapse Plugin
```javascript
import { columnCollapsePlugin } from 'saharos-kanban';

const board = new SaharosKanban('#board', {
  plugins: [
    columnCollapsePlugin({
      storageKey: 'my-collapsed-columns'
    })
  ]
});
```

### Create Custom Plugin
```javascript
function myPlugin(options = {}) {
  return (ctx) => {
    // Access board instance
    const board = ctx.board;
    
    // Get/set state
    const state = ctx.getState();
    ctx.setState(newState);
    
    // Subscribe to events
    ctx.on('card:drag:end', ({ card }) => {
      console.log('Card moved:', card.title);
    });
    
    // Access options
    console.log('Board options:', ctx.options);
  };
}

const board = new SaharosKanban('#board', {
  plugins: [myPlugin({ /* options */ })]
});
```

---

## 🎨 Themes

```javascript
// Import theme CSS
import 'saharos-kanban/dist/theme-dark.css';

// Add theme class to container
document.querySelector('#board-container').classList.add('sk-theme-dark');

// Or add to HTML
<div id="board" class="sk-theme-dark"></div>
```

Available themes:
- `sk-theme-light` - Clean, bright theme
- `sk-theme-dark` - Dark mode
- `sk-theme-colorful` - Vibrant gradients

---

## ⌨️ Keyboard Shortcuts

When a card is focused:
- `↑` `↓` - Navigate up/down in same column
- `←` `→` - Navigate left/right to adjacent columns
- `Space` or `Enter` - Pick up / Drop card
- `Esc` - Cancel card move
- `Home` - Jump to first card in column
- `End` - Jump to last card in column
- `Tab` - Standard focus navigation

---

## 🎯 State Management

```javascript
// Get state
const state = board.getState();
console.log(state.cards, state.columns, state.lanes);

// Load state
board.loadState(newState);

// Load silently (no events)
board.loadState(newState, { silent: true });

// Refresh (re-render)
board.refresh();

// Clear LocalStorage
if (board.storageManager) {
  board.storageManager.clear();
}
```

---

## 🐛 Debugging

```javascript
// Enable debug mode
const board = new SaharosKanban('#board', {
  debug: true  // Logs all events to console
});

// Log current state
console.log('State:', board.getState());

// Check if destroyed
console.log('Destroyed:', board.isDestroyed());
```

---

## 🔗 Useful Links

- **Examples:** See `examples/` folder
- **GitHub:** https://github.com/saharos/saharos-kanban
- **npm:** https://www.npmjs.com/package/saharos-kanban
- **Issues:** https://github.com/saharos/saharos-kanban/issues

---

## 💡 Tips

1. **Always use `helpers.escapeHtml()`** in custom renderers to prevent XSS
2. **Include `.sk-card` class** in custom card renderers for drag & drop
3. **Use `data-card-id` attribute** for proper card identification
4. **Enable debug mode** during development to see all events
5. **Check `examples/` folder** for complete working examples

---

**Version:** 1.0.0  
**License:** MIT
