import fs from 'fs';
import path from 'path';
// Log levels
export var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "ERROR";
    LogLevel["WARN"] = "WARN";
    LogLevel["INFO"] = "INFO";
    LogLevel["DEBUG"] = "DEBUG";
})(LogLevel || (LogLevel = {}));
// Logger class
export class Logger {
    logFile;
    constructor() {
        this.logFile = path.join(process.cwd(), 'logs', 'app.log');
        this.ensureLogDirectory();
    }
    ensureLogDirectory() {
        const logDir = path.dirname(this.logFile);
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
    }
    formatMessage(level, message, meta) {
        const timestamp = new Date().toISOString();
        const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
        return `[${timestamp}] ${level}: ${message}${metaStr}\n`;
    }
    writeToFile(message) {
        fs.appendFileSync(this.logFile, message);
    }
    error(message, meta) {
        const logMessage = this.formatMessage(LogLevel.ERROR, message, meta);
        console.error(logMessage.trim());
        this.writeToFile(logMessage);
    }
    warn(message, meta) {
        const logMessage = this.formatMessage(LogLevel.WARN, message, meta);
        console.warn(logMessage.trim());
        this.writeToFile(logMessage);
    }
    info(message, meta) {
        const logMessage = this.formatMessage(LogLevel.INFO, message, meta);
        console.log(logMessage.trim());
        this.writeToFile(logMessage);
    }
    debug(message, meta) {
        if (process.env.NODE_ENV === 'development') {
            const logMessage = this.formatMessage(LogLevel.DEBUG, message, meta);
            console.log(logMessage.trim());
            this.writeToFile(logMessage);
        }
    }
}
// Create logger instance
export const logger = new Logger();
// Request logging middleware
export const requestLogger = (req, res, next) => {
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
        }
        else {
            logger.info(`${req.method} ${req.url} - ${res.statusCode}`, logData);
        }
    });
    next();
};
//# sourceMappingURL=logger.js.map