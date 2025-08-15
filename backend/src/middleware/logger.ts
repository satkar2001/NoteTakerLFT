import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

// loggers class
export class Logger {
  private logFile: string;

  constructor() {
    this.logFile = path.join(process.cwd(), 'logs', 'app.log');
    this.ensureLogDirectory();
  }

  private ensureLogDirectory() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${message}${metaStr}\n`;
  }

  private writeToFile(message: string) {
    fs.appendFileSync(this.logFile, message);
  }

  error(message: string, meta?: any) {
    const logMessage = this.formatMessage(LogLevel.ERROR, message, meta);
    console.error(logMessage.trim());
    this.writeToFile(logMessage);
  }

  warn(message: string, meta?: any) {
    const logMessage = this.formatMessage(LogLevel.WARN, message, meta);
    console.warn(logMessage.trim());
    this.writeToFile(logMessage);
  }

  info(message: string, meta?: any) {
    const logMessage = this.formatMessage(LogLevel.INFO, message, meta);
    console.log(logMessage.trim());
    this.writeToFile(logMessage);
  }

  debug(message: string, meta?: any) {
    if (process.env.NODE_ENV === 'development') {
      const logMessage = this.formatMessage(LogLevel.DEBUG, message, meta);
      console.log(logMessage.trim());
      this.writeToFile(logMessage);
    }
  }
}

export const logger = new Logger();

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    };

    if (res.statusCode >= 400) {
      logger.error(`${req.method} ${req.url} - ${res.statusCode}`, logData);
    } else {
      logger.info(`${req.method} ${req.url} - ${res.statusCode}`, logData);
    }
  });

  next();
};
