type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  
  private formatTimestamp(): string {
    return new Date().toISOString();
  }
  
  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = this.formatTimestamp();
    const logEntry: LogEntry = {
      timestamp,
      level,
      message,
      ...(data && { data })
    };
    
    if (this.isDevelopment) {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}${data ? ` ${JSON.stringify(data, null, 2)}` : ''}`;
    }
    
    return JSON.stringify(logEntry);
  }
  
  private log(level: LogLevel, message: string, data?: any): void {
    const formattedMessage = this.formatMessage(level, message, data);
    
    switch (level) {
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formattedMessage);
        }
        break;
      case 'info':
        console.info(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'error':
        console.error(formattedMessage);
        break;
    }
  }
  
  debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }
  
  info(message: string, data?: any): void {
    this.log('info', message, data);
  }
  
  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }
  
  error(message: string, data?: any): void {
    this.log('error', message, data);
  }
}

// Export a singleton instance
export const logger = new Logger();

// Export the class for testing or custom instances
export { Logger };
export type { LogLevel, LogEntry };
