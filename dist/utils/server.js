"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const errorhandler_1 = __importDefault(require("./errorhandler"));
const userRoute_1 = __importDefault(require("../routes/userRoute"));
const urlRoutes_1 = __importDefault(require("../routes/urlRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// import helmet from 'helmet';
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("../config");
function createServer() {
    // rate limitig
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: 5 * 60 * 1000,
        max: 100,
        message: 'Too many requests, please try again later.',
    });
    // connection
    const app = (0, express_1.default)();
    (0, config_1.mongoDbConnection)();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, morgan_1.default)('combined'));
    app.use((0, cookie_parser_1.default)());
    app.set('view engine', 'ejs');
    app.set('views', path_1.default.join(__dirname, 'views'));
    // set rate limit
    app.use(limiter);
    // routes
    app.use('/api/user', userRoute_1.default);
    app.use('/', urlRoutes_1.default);
    app.all('*', (req, res, next) => {
        next(new errorhandler_1.default('page not found', 404));
    });
    return app;
}
exports.default = createServer;
//# sourceMappingURL=server.js.map