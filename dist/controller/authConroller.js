"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
require('dotenv').config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("./../model/user");
const errorhandler_1 = __importDefault(require("./../utils/errorhandler"));
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = '';
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer')) {
            token = authHeader.split(' ')[1];
        }
        else if (req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt;
        }
        if (!token) {
            return next(new errorhandler_1.default('Unauthorized Access', 401));
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        const currentTime = Math.floor(Date.now() / 1000);
        // console.log(currentTime);
        // console.log(decodedToken.iat);
        if (decodedToken.iat > currentTime) {
            return next(new errorhandler_1.default('Token expired', 401));
        }
        const user = yield user_1.userModel.findById(decodedToken.id);
        if (!user) {
            return next(new errorhandler_1.default('User not found', 404));
        }
        {
            req.user = user;
            res.locals.user = user;
        }
        next();
    }
    catch (err) {
        next(new errorhandler_1.default(err.message, 500));
    }
});
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=authConroller.js.map