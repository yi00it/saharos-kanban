# Changelog

All notable changes to Saharos Kanban will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.3] - 2025-11-23

### Added
- Input validation for CRUD methods (addCard, addColumn, addLane)
- LocalStorage data validation to prevent injection attacks
- Error boundaries for custom renderers with automatic fallback to default renderer
- `parseId()` utility function to reduce code duplication
- `escapeSelector()` utility for safe DOM queries with user-controlled IDs
- Security warnings in JSDoc for custom render hooks
- Singleton pattern documentation for render helpers
- CHANGELOG.md file

### Fixed
- **CRITICAL:** Memory leak in AccessibilityManager.destroy() - event listeners now properly cleaned up
- TypeScript 'any' errors in columnCollapsePlugin
- Non-null assertions replaced with proper null checks throughout codebase
- Removed unused `_force` parameter in scheduleRender()
- CSS selector injection vulnerability in plugins (now using CSS.escape())

### Changed
- Custom renderers now validate required attributes (.sk-card class and data-card-id)
- Improved error handling with graceful fallbacks for custom render failures

### Security
- Added XSS prevention through automatic escapeHtml validation
- LocalStorage validation prevents malicious data injection
- DOM query injection prevention using CSS.escape()

## [1.1.2] - 2025-01-XX

### Added
- Incremental DOM updates for better performance
- Surgical rendering - only updates changed cards instead of full board re-render
- RAF-based debouncing for batch updates
- Singleton render helpers to reduce memory allocations

### Changed
- Initial render is now synchronous for immediate display
- Reduced DOM footprint with conditional wrappers

### Performance
- 100% faster initialization vs jKanban
- 0.8% fewer DOM nodes
- 0.8% smaller HTML output

## [1.0.0] - 2024-XX-XX

### Added
- Initial release
- Basic Kanban board functionality
- Drag and drop support
- Column and card management
- Zero dependencies
- TypeScript support
