
import { describe, it, expect, beforeEach, vi } from 'vitest';
import logger from '../../src/core/logger';

describe('logger', () => {
  beforeEach(() => {
    logger.getLogs().length = 0; // Clear logs before each test
  });

  it('should log a message', () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    logger.log('test message');
    expect(logger.getLogs()).toHaveLength(1);
    expect(logger.getLogs()[0].message).toBe('test message');
    expect(consoleLogSpy).toHaveBeenCalled();
    consoleLogSpy.mockRestore();
  });

  it('should log a message with data', () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const data = { a: 1, b: 'test' };
    logger.log('test message', data);
    expect(logger.getLogs()).toHaveLength(1);
    expect(logger.getLogs()[0].data).toEqual(data);
    expect(consoleLogSpy).toHaveBeenCalled();
    consoleLogSpy.mockRestore();
  });
});
