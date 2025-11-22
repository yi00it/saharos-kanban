/**
 * Saharos Kanban - Event Bus
 * Simple event emitter implementation for the Kanban board
 */

import type { SaharosEvent, EventHandler } from './types';

/**
 * EventBus class for managing event subscriptions and emissions
 * Zero-dependency implementation
 */
export class EventBus {
  private handlers: Map<SaharosEvent, Set<EventHandler>>;
  private debug: boolean;

  constructor(debug = false) {
    this.handlers = new Map();
    this.debug = debug;
  }

  /**
   * Subscribe to an event
   */
  on<T = unknown>(event: SaharosEvent, handler: EventHandler<T>): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)?.add(handler as EventHandler);

    if (this.debug) {
      console.warn(`[Saharos] Event registered: ${event}`);
    }
  }

  /**
   * Subscribe to an event once (auto-unsubscribe after first call)
   */
  once<T = unknown>(event: SaharosEvent, handler: EventHandler<T>): void {
    const wrappedHandler: EventHandler<T> = (data: T) => {
      handler(data);
      this.off(event, wrappedHandler);
    };
    this.on(event, wrappedHandler);
  }

  /**
   * Unsubscribe from an event
   */
  off<T = unknown>(event: SaharosEvent, handler: EventHandler<T>): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      eventHandlers.delete(handler as EventHandler);
      if (eventHandlers.size === 0) {
        this.handlers.delete(event);
      }
    }

    if (this.debug) {
      console.warn(`[Saharos] Event unregistered: ${event}`);
    }
  }

  /**
   * Emit an event
   */
  emit<T = unknown>(event: SaharosEvent, data?: T): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      eventHandlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          console.error(`[Saharos] Error in event handler for "${event}":`, error);
        }
      });
    }

    if (this.debug) {
      console.warn(`[Saharos] Event emitted: ${event}`, data);
    }
  }

  /**
   * Remove all event handlers
   */
  clear(): void {
    this.handlers.clear();
    if (this.debug) {
      console.warn('[Saharos] All event handlers cleared');
    }
  }

  /**
   * Get the number of handlers for a specific event
   */
  listenerCount(event: SaharosEvent): number {
    return this.handlers.get(event)?.size ?? 0;
  }

  /**
   * Get all registered events
   */
  eventNames(): SaharosEvent[] {
    return Array.from(this.handlers.keys());
  }
}
