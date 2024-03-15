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
exports.resetPassword = exports.forgetPassword = exports.logout = exports.login = exports.updateProfile = exports.signUp = void 0;
const user_1 = require("./../model/user");
const jwt_1 = require("./../utils/jwt");
const errorhandler_1 = __importDefault(require("../utils/errorhandler"));
const email_1 = __importDefault(require("../utils/email"));
const sendResponse_1 = __importDefault(require("./../utils/sendResponse"));
function signUp(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            const newUser = yield user_1.userModel.create(body);
            if (!newUser) {
                return next(new errorhandler_1.default('Fill in the correct details please', 400));
            }
            const token = yield (0, jwt_1.jwtToken)(newUser._id);
            const sendMail = new email_1.default();
            yield sendMail.sendWelcomeEmail(newUser);
            res.status(201).json({
                status: 'success',
                message: 'Sign up complete',
                token,
                user: newUser,
            });
            console.log('we end here');
        }
        catch (err) {
            next(new errorhandler_1.default(err, 500));
        }
    });
}
exports.signUp = signUp;
function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const loginDetails = req.body;
            const isValidUser = yield user_1.userModel.findOne({ email: loginDetails.email });
            if (!isValidUser) {
                return next(new errorhandler_1.default('This user is not found. Kindly sign up', 404));
            }
            const isValidPassword = yield isValidUser.isValidPassword(loginDetails.password, isValidUser.password);
            if (!isValidPassword) {
                return next(new errorhandler_1.default('Invalid password or email', 401));
            }
            const token = yield (0, jwt_1.jwtToken)(isValidUser._id);
            res.status(200).json({
                status: 'success',
                message: 'You are logged in now',
                token,
                user: isValidUser,
            });
        }
        catch (err) {
            next(new errorhandler_1.default(err, 500));
        }
    });
}
exports.login = login;
function updateProfile(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const sendResponse = new sendResponse_1.default(res);
        try {
            if (req.user.active === true) {
                const updatesDetails = req.body;
                updatesDetails.photo = req.file
                    ? req.file.filename
                    : req.user.photo;
                const updatedUser = yield user_1.userModel
                    .findByIdAndUpdate(req.user._id, updatesDetails, {
                    new: true,
                    runValidators: true,
                })
                    .select('-password');
                if (updatedUser) {
                    sendResponse.sendJson(updatedUser, 'Your profile is updated', 200);
                }
            }
            else {
                return next(new errorhandler_1.default('User does not exist. Kindly sign up', 404));
            }
        }
        catch (err) {
            next(new errorhandler_1.default(err, 500));
        }
    });
}
exports.updateProfile = updateProfile;
const logout = (req, res) => {
    return res
        .status(200)
        .json({ message: 'You have been successfully logged out' });
};
exports.logout = logout;
function forgetPassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_1.userModel
                .findOne({ email: req.body.email })
                .select('-password');
            if (!user)
                return next(new errorhandler_1.default('This user does not exist', 404));
            const resetToken = yield user.createResetToken();
            console.log(resetToken);
            const url = `https://briefly-26p0.onrender.com/resetPassword/${resetToken}`;
            const sendMail = new email_1.default();
            yield sendMail.sendPasswordResetEmail(user, resetToken, url);
            yield user.save({ validateBeforeSave: false });
            res.status(200).json({
                status: 'success',
                message: 'Your password reset token has been sent. Check your mailbox',
            });
        }
        catch (err) {
            new errorhandler_1.default(err, 500);
        }
    });
}
exports.forgetPassword = forgetPassword;
function resetPassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resetToken = req.body.token || req.params.Token;
            const user = yield user_1.userModel
                .findOne({
                resetPasswordToken: resetToken,
                resetTimeExp: { $gt: Date.now() },
            })
                .select('-password');
            if (!user)
                return next(new errorhandler_1.default('Invalid token or expired token', 404));
            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetTimeExp = undefined;
            yield user.save();
            const token = yield (0, jwt_1.jwtToken)(user._id);
            res.status(200).json({
                status: 'success',
                message: 'A new password has been set',
                token,
                user,
            });
        }
        catch (err) {
            new errorhandler_1.default(err, 500);
        }
    });
}
exports.resetPassword = resetPassword;
//# sourceMappingURL=userController.js.map