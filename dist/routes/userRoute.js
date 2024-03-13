"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authConroller_1 = require("./../controller/authConroller");
const userController_1 = require("./../controller/userController");
const userRouter = express_1.default.Router();
userRouter.post('/register', userController_1.signUp);
userRouter.post('/login', userController_1.login);
userRouter.patch('/Update_me', authConroller_1.isAuthenticated, userController_1.updateProfile);
userRouter.patch('/reset_Password', userController_1.resetPassword);
userRouter.post('/forget_Password', userController_1.forgetPassword);
userRouter.post('/ logout', authConroller_1.isAuthenticated, userController_1.logout);
exports.default = userRouter;
//# sourceMappingURL=userRoute.js.map