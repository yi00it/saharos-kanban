# Changelog

All notable changes to Saharos Kanban will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-22

### 🎉 Production Release

This is the first production-ready release of Saharos Kanban! A zero-dependency, framework-agnostic Kanban board library built with TypeScript.

### Added - Milestone 7 (v1.0.0)
- **Themes**: Three beautiful themes (Light, Dark, Colorful)
- **Examples Gallery**: Comprehensive examples showcase page (`examples/index.html`)
- **Documentation**: Complete CHANGELOG.md and production-ready README
- **License**: MIT License
- **Build**: CDN-ready builds (ESM + UMD)

## [0.6.0] - 2025-11-22

### Added - Milestone 6: Plugin System
- **Plugin Architecture**: Extensible `use(plugin)` API with PluginContext
- **WIP Limit Plugin**: Visual indicators and enforcement of work-in-progress limits
  - Configurable limits via column metadata
  - Color-coded states (normal, at-limit, exceeded)
  - Warning animations and custom callbacks
- **Card Aging Plugin**: Track time cards spend in columns
  - Configurable warning/danger thresholds (3/7 days default)
  - Visual indicators with orange/red borders
  - Age display on cards
- **Column Collapse Plugin**: Collapsible columns with LocalStorage persistence
  - Toggle buttons in headers
  - Smooth animations
- **Plugin Utilities**: Helper functions (`addPluginStyles`, `debounce`, `throttle`)
- **Plugin Demo**: Interactive example (`examples/plugins.html`)

### Files Created
- `src/core/plugins.ts` - Plugin system and 3 example plugins (440 lines)
- `examples/plugins.html` - Plugin demo (350 lines)

## [0.5.0] - 2025-11-22

### Added - Milestone 5: Accessibility & Mobile
- **Keyboard Navigation**: Full keyboard-only operation
  - Arrow keys (up/down/left/right) for navigation
  - Space/Enter to pick up and drop cards
  - Escape to cancel moves
  - Home/End to jump to first/last card
- **ARIA Support**: Complete screen reader support
  - Proper ARIA roles (`role="list"`, `role="listitem"`, `role="region"`)
  - ARIA labels for cards, columns, and board
  - Configurable labels via `a11y` options
- **Focus Management**: Visual focus indicators and tracking
  - High-contrast focus outlines
  - Focus-visible support
  - Special "picking" state visualization
- **Touch & Mobile Support**: Native touch event handling
  - Pointer Events API for touch
  - `touch-action` CSS optimization
  - Larger touch targets (48px min on mobile)
  - Mobile-responsive layouts
- **A11y Events**: New events (`a11y:focus:card`, `a11y:move:card`)
- **A11y Demo**: Interactive example (`examples/a11y.html`)

### Files Created
- `src/dom/a11y.ts` - Accessibility system (460 lines)
- `examples/a11y.html` - Accessibility demo (290 lines)

### Enhanced
- `src/styles/index.css` - Focus styles, touch-action CSS, mobile optimizations

## [0.4.0] - 2025-11-22

### Added - Milestone 4: Custom Rendering
- **Enhanced CSS Variables**: 50+ CSS variables for complete theming
  - Typography system (font sizes, weights, line heights)
  - Comprehensive color system
  - Spacing scale (xs to 2xl)
  - Shadow system (base, hover, active)
  - Drag & drop customization
- **Render Helpers**: Extended `RenderHelpers` interface
  - `escapeHtml()` for XSS protection
  - `addClass()` and `removeClass()` utilities
- **Custom Rendering Example**: Advanced demo (`examples/custom-render.html`)
  - Rich cards with avatars, priorities, due dates
  - WIP limits on columns
  - Team lanes with velocity tracking

### Files Created
- `examples/custom-render.html` - Custom rendering demo (290 lines)

### Enhanced
- `src/core/types.ts` - Extended RenderHelpers interface
- `src/dom/render.ts` - Added helper functions
- `src/styles/index.css` - 50+ CSS variables

## [0.3.0] - 2025-11-22

### Added - Milestone 3: Full API
- **CRUD Operations**: Complete API for cards, columns, and lanes
  - `addCard()`, `updateCard()`, `removeCard()`, `moveCard()`, `scrollToCard()`
  - `addColumn()`, `updateColumn()`, `removeColumn()`, `moveColumn()`
  - `addLane()`, `updateLane()`, `removeLane()`, `moveLane()`
- **LocalStorage**: Automatic state persistence
  - `StorageManager` class
  - Auto-save on state changes
  - Configurable storage key
  - `clearStorage()` method
- **API Demo**: Interactive CRUD showcase (`examples/api-demo.html`)

### Files Created
- `src/core/storage.ts` - LocalStorage manager
- `examples/api-demo.html` - API demo

### Enhanced
- `src/core/Kanban.ts` - Added all CRUD methods (200+ lines)
- All CRUD operations emit proper events

## [0.2.0] - 2025-11-22

### Added - Milestone 2: Drag & Drop
- **Drag & Drop Engine**: Pointer Events-based implementation
  - Drag mirror element with visual feedback
  - Hit-testing system for accurate drop detection
  - Placeholder system for insertion preview
  - Card reordering within same column
  - Card moving across columns
  - Drag tolerance to prevent accidental drags
- **Drag Events**: `card:drag:start`, `card:drag:over`, `card:drag:end`, `card:drag:cancel`
- **Drag Options**: Configurable via `DragOptions` interface

### Files Created
- `src/core/dnd.ts` - Drag and drop engine (400+ lines)

### Fixed
- **ID Type Conversion**: Critical bug fix for dataset ID handling
  - DOM `dataset` returns strings, need conversion for numeric IDs
  - Added regex check `/^\d+$/` for string-to-number conversion

## [0.1.0] - 2025-11-22

### Added - Milestone 1: Foundation
- **Project Setup**: Complete build configuration
  - TypeScript with strict mode
  - Vite for development and building
  - ESLint + Prettier
  - ESM and UMD builds
- **Core Architecture**:
  - `EventBus` - Zero-dependency event system
  - `StateManager` - Single source of truth for board state
  - `SaharosKanban` - Main class with full API
  - Complete TypeScript type definitions
- **Rendering System**:
  - Default renderers for cards, columns, lanes
  - Render hooks for customization
  - RenderHelpers utility
- **Styling**: Core CSS with CSS variables
- **Basic Example**: Functional demo (`examples/basic.html`)

### Files Created
- `src/core/types.ts` - TypeScript definitions
- `src/core/events.ts` - Event bus
- `src/core/state.ts` - State management
- `src/core/Kanban.ts` - Main class
- `src/dom/render.ts` - Rendering system
- `src/styles/index.css` - Core styles
- `examples/basic.html` - Basic demo

## Architecture Principles

1. **Zero Dependencies** - Completely standalone, no external libraries
2. **Never Re-render Entire Board** - Surgical DOM updates only
3. **All Mutations Emit Events** - Consistent event system throughout
4. **TypeScript Internally, JavaScript Output** - Best of both worlds
5. **Minimal DOM Footprint** - Performance-focused architecture
6. **Native Drag & Drop** - Using Pointer Events API
7. **Maintain High Performance** - Optimized for large boards
8. **Accessibility First** - ARIA support from the ground up

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions  
- Modern mobile browsers

## Links

- [GitHub Repository](https://github.com/saharos/saharos-kanban)
- [npm Package](https://www.npmjs.com/package/saharos-kanban)
- [Documentation](https://github.com/saharos/saharos-kanban#readme)

---

**Note**: This project follows milestone-based development as specified in `saharos-kanban.md`.
