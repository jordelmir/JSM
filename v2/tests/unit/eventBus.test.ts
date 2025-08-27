
import { describe, it, expect, vi } from 'vitest';
import eventBus from '../../src/core/eventBus';

describe('eventBus', () => {
  it('should register and trigger an event', () => {
    const listener = vi.fn();
    eventBus.on('customEvent', listener);
    const data = { message: 'test' };
    eventBus.emit('customEvent', data);
    expect(listener).toHaveBeenCalledWith(data);
  });

  it('should unregister an event listener', () => {
    const listener = vi.fn();
    eventBus.on('customEvent', listener);
    eventBus.off('customEvent', listener);
    eventBus.emit('customEvent', { message: 'test' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('should not fail when unregistering a non-existent listener', () => {
    const listener = vi.fn();
    expect(() => eventBus.off('customEvent', listener)).not.toThrow();
  });

  it('should not fail when emitting an event with no listeners', () => {
    expect(() => eventBus.emit('customEvent', { message: 'test' })).not.toThrow();
  });
});
