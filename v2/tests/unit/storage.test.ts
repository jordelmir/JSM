
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as storage from '../../src/core/storage';

describe('storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should set and get an item from localStorage', () => {
    const key = 'testKey';
    const value = { a: 1, b: 'test' };
    storage.set(key, value);
    const result = storage.get(key);
    expect(result).toEqual(value);
  });

  it('should return null if item is not found', () => {
    const result = storage.get('nonExistentKey');
    expect(result).toBeNull();
  });

  it('should remove an item from localStorage', () => {
    const key = 'testKey';
    const value = 'testValue';
    storage.set(key, value);
    storage.remove(key);
    const result = storage.get(key);
    expect(result).toBeNull();
  });

  it('should clear all items from localStorage', () => {
    storage.set('key1', 'value1');
    storage.set('key2', 'value2');
    storage.clear();
    expect(storage.get('key1')).toBeNull();
    expect(storage.get('key2')).toBeNull();
  });

  it('should handle errors when setting an item', () => {
    const key = 'testKey';
    const value = { a: 1 };
    const error = new Error('Test error');
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw error;
    });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    storage.set(key, value);
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Error setting item in localStorage: ${key}`, error);
    consoleErrorSpy.mockRestore();
  });
});
