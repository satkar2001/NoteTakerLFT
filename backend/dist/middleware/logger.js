"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = exports.logger = exports.Logger = exports.LogLevel = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Log levels
var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "ERROR";
    LogLevel["WARN"] = "WARN";
    LogLevel["INFO"] = "INFO";
    LogLevel["DEBUG"] = "DEBUG";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
// Logger class
class Logger {
    constructor() {
        this.logFile = path_1.default.join(process.cwd(), 'logs', 'app.log');
        this.ensureLogDirectory();
    }
    ensureLogDirectory() {
        const logDir = path_1.default.dirname(this.logFile);
        if (!fs_1.default.existsSync(logDir)) {
            fs_1.default.mkdirSync(logDir, { recursive: true });
        }
    }
    formatMessage(level, message, meta) {
        const timestamp = new Date().toISOString();
        const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
        return `[${timestamp}] ${level}: ${message}${metaStr}\n`;
    }
    writeToFile(message) {
        fs_1.default.appendFileSync(this.logFile, message);
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
exports.Logger = Logger;
// Create logger instance
exports.logger = new Logger();
// Request logging middleware
const requestLogger = (req, res, next) => {
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
            exports.logger.error(`${req.method} ${req.url} - ${res.statusCode}`, logData);
        }
        else {
            exports.logger.info(`${req.method} ${req.url} - ${res.statusCode}`, logData);
        }
    });
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=logger.js.map