/**
 * @module core/logger
 * @description A configurable, level-based Singleton logger.
 */

export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: unknown;
}

interface LoggerConfig {
  minLevel: LogLevel;
  enableConsoleLog: boolean;
}

export class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private config: LoggerConfig = {
    // Default to INFO level for production, and enable console logging.
    // Vite provides import.meta.env.MODE to distinguish environments.
    minLevel: import.meta.env.MODE === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
    enableConsoleLog: true,
  };

  // Private constructor to prevent direct instantiation.
  private constructor() {}

  /**
   * Gets the single instance of the Logger.
   * @returns {Logger} The singleton instance of the Logger.
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Configures the logger instance. Can be called at any time to change behavior.
   * @param {Partial<LoggerConfig>} newConfig - A partial configuration object to override default settings.
   */
  public configure(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Logs a message at the DEBUG level.
   * Messages will only be recorded if the configured minLevel is DEBUG.
   * @param {string} message - The message to log.
   * @param {unknown} [data] - Optional data to include with the log entry.
   */
  public debug(message: string, data?: unknown): void {
    this.addLog(LogLevel.DEBUG, message, data);
  }

  /**
   * Logs a message at the INFO level.
   * @param {string} message - The message to log.
   * @param {unknown} [data] - Optional data to include with the log entry.
   */
  public info(message: string, data?: unknown): void {
    this.addLog(LogLevel.INFO, message, data);
  }

  /**
   * Logs a message at the WARN level.
   * @param {string} message - The message to log.
   * @param {unknown} [data] - Optional data to include with the log entry.
   */
  public warn(message: string, data?: unknown): void {
    this.addLog(LogLevel.WARN, message, data);
  }

  /**
   * Logs a message at the ERROR level.
   * @param {string} message - The message to log.
   * @param {unknown} [data] - Optional data to include with the log entry.
   */
  public error(message: string, data?: unknown): void {
    this.addLog(LogLevel.ERROR, message, data);
  }

  private addLog(level: LogLevel, message: string, data?: unknown): void {
    if (level < this.config.minLevel) {
      return;
    }

    const entry: LogEntry = { timestamp: new Date(), level, message, data };
    this.logs.push(entry);

    if (this.config.enableConsoleLog) {
      const levelString = LogLevel[level];
      const logMessage = `[${entry.timestamp.toISOString()}] [${levelString}] ${message}`;
      
      switch(level) {
        case LogLevel.DEBUG:
          console.debug(logMessage, data || '');
          break;
        case LogLevel.INFO:
          console.info(logMessage, data || '');
          break;
        case LogLevel.WARN:
          console.warn(logMessage, data || '');
          break;
        case LogLevel.ERROR:
          console.error(logMessage, data || '');
          break;
        default:
          console.log(logMessage, data || '');
          break;
      }
    }
  }

  /**
   * Returns a read-only copy of all recorded log entries.
   * This is useful for debugging or displaying logs in a UI.
   * The returned array is a clone to prevent mutation of the internal state.
   * @returns {readonly LogEntry[]} A new array containing all log entries.
   */
  public getLogs(): readonly LogEntry[] {
    // Return a copy to prevent mutation of the internal logs array.
    return [...this.logs];
  }
}

// Export the single instance of the logger.
const logger = Logger.getInstance();
export default logger;
