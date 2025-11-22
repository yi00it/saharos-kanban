/**
 * Saharos Kanban - Main Entry Point
 * Zero-dependency Kanban board library
 * 
 * @version 1.0.0
 * @author Saharos Team
 * @license MIT
 */

// Import styles
import './styles/index.css';

// Main class
export { SaharosKanban } from './core/Kanban';

// Export types for TypeScript users
export type {
  ID,
  Lane,
  Column,
  Card,
  KanbanState,
  ColumnRule,
  DragOptions,
  A11yOptions,
  RenderHelpers,
  RenderCardHook,
  RenderColumnHeaderHook,
  RenderLaneHeaderHook,
  SaharosEvent,
  EventHandler,
  SaharosEventHandlers,
  PluginContext,
  SaharosKanbanPlugin,
  SaharosKanbanOptions,
  MoveCardOptions,
  LoadStateOptions,
  AddItemOptions,
} from './core/types';

// Export utilities
export { EventBus } from './core/events';
export { StateManager } from './core/state';
export {
  createRenderHelpers,
  defaultCardRenderer,
  defaultColumnHeaderRenderer,
  defaultLaneHeaderRenderer,
} from './dom/render';

// Export plugins (Milestone 6)
export {
  wipLimitPlugin,
  cardAgingPlugin,
  columnCollapsePlugin,
  addPluginStyles,
  debounce,
  throttle,
} from './core/plugins';
