/**
 * Unit tests for EventBus
 */

import { EventBus } from '../../src/core/events';

describe('EventBus', () => {
  it('should register and emit events', () => {
    const bus = new EventBus();
    const handler = jest.fn();

    bus.on('board:ready', handler);
    bus.emit('board:ready');

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should unregister events', () => {
    const bus = new EventBus();
    const handler = jest.fn();

    bus.on('board:ready', handler);
    bus.off('board:ready', handler);
    bus.emit('board:ready');

    expect(handler).not.toHaveBeenCalled();
  });

  it('should support once() for one-time subscriptions', () => {
    const bus = new EventBus();
    const handler = jest.fn();

    bus.once('board:ready', handler);
    bus.emit('board:ready');
    bus.emit('board:ready');

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should handle errors in event handlers gracefully', () => {
    const bus = new EventBus();
    const errorHandler = () => {
      throw new Error('Test error');
    };
    const normalHandler = jest.fn();

    bus.on('board:ready', errorHandler);
    bus.on('board:ready', normalHandler);
    
    // Should not throw
    expect(() => bus.emit('board:ready')).not.toThrow();
    expect(normalHandler).toHaveBeenCalled();
  });
});
