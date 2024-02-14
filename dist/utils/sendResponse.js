"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SendResponse {
    constructor(res) {
        this.res = res;
    }
    sendJson(doc, message, statusCode) {
        return this.res.status(statusCode).json({
            status: 'SUCCESS',
            message,
            size: Array.isArray(doc) ? doc.length : 1,
            data: doc,
        });
    }
}
exports.default = SendResponse;
//# sourceMappingURL=sendResponse.js.map