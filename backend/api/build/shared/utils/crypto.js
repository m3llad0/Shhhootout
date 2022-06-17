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
exports.isStrongPassword = exports.verifyPassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const specialCharRegex = /[~`!#$%^&*+=-\[\]\\\';,\/{}|\":<>?]/;
const hashPassword = (password, saltRounds = 10) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Generate a salt
        const salt = yield bcrypt_1.default.genSalt(saltRounds);
        // Hash password
        return yield bcrypt_1.default.hash(password, salt);
    }
    catch (error) {
        console.error(error);
    }
    // Return null if error
    return null;
});
exports.hashPassword = hashPassword;
const verifyPassword = (password, hash) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield bcrypt_1.default.compareSync(password, hash);
    }
    catch (error) {
        console.error(error);
    }
    return false;
});
exports.verifyPassword = verifyPassword;
const isStrongPassword = (password) => {
    if (password.length < 10) {
        return false;
    }
    let hasNumber = false;
    let hasSpecial = false;
    for (let c of password) {
        if (c >= '0' && c <= '9' && !hasNumber) {
            hasNumber = true;
        }
        else if (specialCharRegex.test(c) && !hasSpecial) {
            hasSpecial = true;
        }
        else if (hasNumber && hasSpecial) {
            return true;
        }
    }
    return false;
};
exports.isStrongPassword = isStrongPassword;
//# sourceMappingURL=crypto.js.map