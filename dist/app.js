"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const errorHandler_1 = __importDefault(require("./controller/errorHandler"));
const errorhandler_1 = __importDefault(require("./utils/errorhandler"));
const server_1 = __importDefault(require("./utils/server"));
const PORT = process.env.PORT || 3000;
console.log(process.env.NODE_ENV);
const app = (0, server_1.default)();
app.all('*', (req, res, next) => {
    next(new errorhandler_1.default('page not found', 404));
});
app.use(errorHandler_1.default);
app.listen(PORT, () => {
    console.log('Server is up and paying attention');
});
//# sourceMappingURL=app.js.map