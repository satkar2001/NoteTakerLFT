"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
dotenv_1.default.config();
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const noteRoutes_js_1 = __importDefault(require("./routes/noteRoutes.js"));
const errorHandler_js_1 = require("./middleware/errorHandler.js");
const logger_js_1 = require("./middleware/logger.js");
const swagger_js_1 = require("./config/swagger.js");
const app = (0, express_1.default)();
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? [
            'https://notetaker-frontend.onrender.com',
            'https://your-frontend-domain.com'
        ]
        : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200
};
// Middleware
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(logger_js_1.requestLogger);
// for swagger
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_js_1.specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'NoteTaker API Documentation'
}));
// Routes
app.use('/api/auth', authRoutes_js_1.default);
app.use('/api/notes', noteRoutes_js_1.default);
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
// 404 
app.use(errorHandler_js_1.notFound);
app.use(errorHandler_js_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map