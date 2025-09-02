import { describe, it, expect, vi } from 'vitest';
import logger, { Logger, LogLevel } from '../../src/core/logger';

describe('Logger', () => {
  // Note: Since the logger is a singleton, its state persists between tests.
  // We configure it before certain tests to ensure a predictable state.

  it('should be a singleton instance', () => {
    const instance1 = Logger.getInstance();
    const instance2 = Logger.getInstance();
    expect(instance1).toBe(instance2);
    expect(instance1).toBe(logger);
  });

  it('should log info, warn, and error messages by default', () => {
    // Set a known initial state
    logger.configure({ minLevel: LogLevel.INFO });
    const initialLogCount = logger.getLogs().length;

    logger.info('info test');
    logger.warn('warn test');
    logger.error('error test');

    const finalLogCount = logger.getLogs().length;
    expect(finalLogCount).toBe(initialLogCount + 3);
  });

  it('should not log debug messages if minLevel is INFO', () => {
    logger.configure({ minLevel: LogLevel.INFO });
    const initialLogCount = logger.getLogs().length;

    logger.debug('debug test');

    const finalLogCount = logger.getLogs().length;
    expect(finalLogCount).toBe(initialLogCount);
  });

  it('should respect the configured minimum log level', () => {
    logger.configure({ minLevel: LogLevel.WARN });
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const initialLogCount = logger.getLogs().length;

    logger.info('this should not be logged');
    logger.warn('this should be logged');
    
    const finalLogCount = logger.getLogs().length;
    expect(finalLogCount).toBe(initialLogCount + 1);
    expect(logger.getLogs().at(-1)?.level).toBe(LogLevel.WARN);
    expect(consoleWarnSpy).toHaveBeenCalled();

    consoleWarnSpy.mockRestore();
    // Reset to a default state for subsequent tests
    logger.configure({ minLevel: LogLevel.INFO });
  });

  it('should disable console logging when configured', () => {
    logger.configure({ enableConsoleLog: false });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    logger.error('logging without console output');
    
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
    // Reset to a default state for subsequent tests
    logger.configure({ enableConsoleLog: true });
  });

  it('getLogs() should return a copy, not a reference', () => {
    logger.info('test for immutability');
    const logs1 = logger.getLogs();
    const initialLength = logs1.length;

    // Try to mutate the returned array
    (logs1 as any[]).push('mutation attempt');

    const logs2 = logger.getLogs();
    // The internal logs should not have changed
    expect(logs2.length).toBe(initialLength);
    expect(logs2.at(-1)?.message).toBe('test for immutability');
  });
});