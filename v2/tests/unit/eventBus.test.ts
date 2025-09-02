import { describe, it, expect, vi } from 'vitest';
import eventBus, { EventBus } from '../../src/core/eventBus';
import logger from '../../src/core/logger'; // Import logger to spy on it

describe('EventBus', () => {

  it('should be a singleton instance', () => {
    const instance1 = EventBus.getInstance();
    const instance2 = EventBus.getInstance();
    expect(instance1).toBe(instance2);
    expect(instance1).toBe(eventBus);
  });

  it('should subscribe to and emit an event', () => {
    const listener = vi.fn();
    eventBus.on('notification', listener);
    const data = { type: 'success' as const, message: 'Test notification' };
    eventBus.emit('notification', data);
    expect(listener).toHaveBeenCalledWith(data);
    eventBus.off('notification', listener); // Cleanup
  });

  it('should unsubscribe a listener', () => {
    const listener = vi.fn();
    eventBus.on('notification', listener);
    eventBus.off('notification', listener);
    eventBus.emit('notification', { type: 'info', message: 'This should not be received' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('should not fail when unsubscribing a non-existent listener', () => {
    const listener = vi.fn();
    expect(() => eventBus.off('notification', listener)).not.toThrow();
  });

  it('should not fail when emitting an event with no listeners', () => {
    // Use a unique event name to ensure no listeners from other tests interfere
    expect(() => eventBus.emit('customEvent', { message: 'hello' })).not.toThrow();
  });

  it('should continue notifying other listeners if one throws an error', () => {
    const errorListener = vi.fn(() => {
      throw new Error('Listener failed!');
    });
    const healthyListener = vi.fn();
    const loggerSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});

    // Use a unique event name for this test
    const eventName = 'purchaseCompleted';

    eventBus.on(eventName, errorListener);
    eventBus.on(eventName, healthyListener);

    const eventData = { id: 123, amount: 99.99, date: new Date().toISOString() };
    eventBus.emit(eventName, eventData);

    // Check that the error was logged
    expect(loggerSpy).toHaveBeenCalled();
    expect(loggerSpy).toHaveBeenCalledWith(
      `Error in event listener for event: ${eventName}`,
      expect.any(Object)
    );

    // Crucially, check that the second listener was still called
    expect(healthyListener).toHaveBeenCalledWith(eventData);

    // Cleanup
    loggerSpy.mockRestore();
    eventBus.off(eventName, errorListener);
    eventBus.off(eventName, healthyListener);
  });
});