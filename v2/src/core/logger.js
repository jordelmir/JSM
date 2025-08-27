// v2/src/core/logger.js

class Logger {
  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }
    this.logs = [];
    Logger.instance = this;
  }

  log(message) {
    const timestamp = new Date().toISOString();
    this.logs.push(`[${timestamp}] ${message}`);
    console.log(`[LOGGER] ${message}`);
  }

  getLogs() {
    return this.logs;
  }
}

const logger = new Logger();
Object.freeze(logger); // Ensure the instance cannot be modified

export default logger;