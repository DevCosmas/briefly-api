"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.userModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                return validator_1.default.isEmail(value);
            },
            message: 'Invalid email address',
        },
    },
    photo: {
        type: String,
        trim: true,
        default: 'TackleDefaultPics.png',
    },
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    resetPasswordToken: String,
    resetTimeExp: Date,
    active: {
        type: Boolean,
        default: true,
    },
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return next();
        this.password = yield bcrypt_1.default.hash(this.password, 12);
    });
});
userSchema.methods.isValidPassword = function (candidatePassword, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(candidatePassword, userPassword);
    });
};
userSchema.methods.createResetToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const resetToken = Math.floor(Math.random() * 1000000) + 1;
        const resetTokenStr = resetToken.toString();
        this.resetPasswordToken = resetTokenStr;
        this.resetTimeExp = new Date(Date.now() + 10 * 60 * 1000);
        return resetTokenStr;
    });
};
const userModel = mongoose_1.default.model('User', userSchema);
exports.userModel = userModel;
//# sourceMappingURL=user.js.map