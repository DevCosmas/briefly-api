"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const errorHandler_1 = __importDefault(require("../controller/errorHandler"));
const errorhandler_1 = __importDefault(require("./errorhandler"));
const userRoute_1 = __importDefault(require(".././routes/userRoute"));
const urlRoutes_1 = __importDefault(require(".././routes/urlRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
// import helmet from 'helmet';
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("../config");
function createServer() {
    // connection
    const app = (0, express_1.default)();
    (0, config_1.mongoDbConnection)();
    console.log(process.env.NODE_ENV);
    app.set('trust proxy', 1);
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, morgan_1.default)('combined'));
    app.use((0, cors_1.default)({
        origin: '*',
        credentials: true,
    }));
    app.use((0, cookie_parser_1.default)());
    app.set('view engine', 'ejs');
    app.set('views', path_1.default.join(__dirname, 'views'));
    // routes
    app.use('/api/user', userRoute_1.default);
    app.use('/', urlRoutes_1.default);
    app.all('*', (req, res, next) => {
        next(new errorhandler_1.default('page not found', 404));
    });
    app.use(errorHandler_1.default);
    return app;
}
exports.default = createServer;
//# sourceMappingURL=server.js.map