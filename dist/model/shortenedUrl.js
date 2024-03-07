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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const UrlSchema = new mongoose_1.Schema({
    shortUrl: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
    },
    originalUrl: {
        type: String,
        trim: true,
        required: [true, 'valid url required'],
        validate: {
            validator: (value) => validator_1.default.isURL(value),
            message: 'Invalid URL',
        },
    },
    whoVisited: {
        type: [String],
        default: [],
    },
    visitationCount: {
        type: Number,
        default: 0,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    newUrl: String,
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
const UrlModel = mongoose_1.default.model('Url', UrlSchema);
exports.UrlModel = UrlModel;
//# sourceMappingURL=shortenedUrl.js.map