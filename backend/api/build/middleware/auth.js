"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticated = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (data) => {
    return jsonwebtoken_1.default.sign(data, process.env.JWT_SECRET, { expiresIn: '86400s' });
};
exports.generateAccessToken = generateAccessToken;
// Middleware
const authenticated = () => authenticateToken;
exports.authenticated = authenticated;
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, data) => {
        console.log(err);
        if (err)
            return res.sendStatus(403);
        req.params.auth = data;
        next();
    });
}
//# sourceMappingURL=auth.js.map