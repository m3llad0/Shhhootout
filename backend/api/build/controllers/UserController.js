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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserStatistics = exports.LoginUser = exports.RegisterUser = void 0;
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const crypto_1 = require("../shared/utils/crypto");
const USER_TABLE = 'user';
const USER_STATISTICS = 'global_statistic';
const ERR_MISSING_USER_FIELD = "Missing `username`";
const ERR_MISSING_ACCOUNT_FIELD = "Missing `account`";
const ERR_MISSING_PASSWORD_FIELD = "Missing `password`";
const ERR_ACCOUNT_NOT_FOUND = "Account not found";
const ERR_MISSING_EMAIL_FIELD = "Missing `email`";
const ERR_INVALID_EMAIL = "email is invalid: ";
const ERR_INVALID_USERNAME_LENGTH = "username length is too short";
const ERR_WRONG_PASSWORD = "wrong password";
const ERR_PASSWORD_WEAK = "password is weak";
const emailRegex = new RegExp(/^\S+@\S+\.\S\S+$/);
/**
 * Creates an unverified user, sends an email with a activation token.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}
 */
const RegisterUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    // Get request json body
    const username = (_a = req.body) === null || _a === void 0 ? void 0 : _a.username;
    const email = (_b = req.body) === null || _b === void 0 ? void 0 : _b.email;
    const password = (_c = req.body) === null || _c === void 0 ? void 0 : _c.password;
    // Return error if user field is missing
    if (!username) {
        res.status(400).json({
            message: ERR_MISSING_USER_FIELD
        });
        return;
    }
    // Return error if email field is missing
    if (!email) {
        res.status(400).json({
            message: ERR_MISSING_EMAIL_FIELD
        });
        return;
    }
    // Return error if email field is missing
    if (!password) {
        res.status(400).json({
            message: ERR_MISSING_PASSWORD_FIELD
        });
        return;
    }
    // Validate that the user has a minimun length of 5 characters.
    if ((username === null || username === void 0 ? void 0 : username.length) < 5) {
        res.status(400).json({
            message: ERR_INVALID_USERNAME_LENGTH + ": " + username.length
        });
        return;
    }
    // Validate that the email contains an '@' and characters before and after and a TLD of at least two characters.
    if (!emailRegex.test(email)) {
        res.status(400).json({
            message: ERR_INVALID_EMAIL + email
        });
        return;
    }
    // Validate password is strong
    if (!(0, crypto_1.isStrongPassword)(password)) {
        res.status(400).json({
            message: ERR_PASSWORD_WEAK
        });
        return;
    }
    const hashedPassword = yield (0, crypto_1.hashPassword)(password);
    if (hashedPassword == null) {
        res.sendStatus(500);
        return;
    }
    let query = `insert into ${USER_TABLE} (username,email,password) values (?, ?, ?);`;
    let values = [username, email, hashedPassword];
    // Declare poolConnection so we can close it in case something goes wrong.
    let poolConnection;
    try {
        // Get pool connection from the database and create a user.
        poolConnection = yield db_1.db.getConnection();
        const [data,] = yield poolConnection.query(query, values);
    }
    catch (error) {
        console.error(error);
        // The user is a duplicated entry, either the email or username is taken.
        if ((error === null || error === void 0 ? void 0 : error.code) == 'ER_DUP_ENTRY') {
            res.status(400).json({
                message: `ERROR: ${error === null || error === void 0 ? void 0 : error.sqlMessage}`
            });
            return;
        }
        // An unknown error happened while performing a database operation.
        res.status(500).json({
            message: "An error has occured."
        });
        return;
    }
    finally {
        // We close the connection to the database, so other instances can use it.
        poolConnection === null || poolConnection === void 0 ? void 0 : poolConnection.release();
    }
    res.status(201).json({
        message: `User ${username} created!`
    });
    return;
});
exports.RegisterUser = RegisterUser;
/**
 * Tries to login a verified user with its credentials, and returns a jwt token.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}
 */
const LoginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    const account = (_d = req.body) === null || _d === void 0 ? void 0 : _d.account;
    const password = (_e = req.body) === null || _e === void 0 ? void 0 : _e.password;
    // Return error if user field is missing
    if (!account) {
        res.status(400).json({
            message: ERR_MISSING_ACCOUNT_FIELD
        });
        return;
    }
    // Return error if email field is missing
    if (!password) {
        res.status(400).json({
            message: ERR_MISSING_PASSWORD_FIELD
        });
        return;
    }
    let poolConnection;
    let user_id;
    const query = `select BIN_TO_UUID(user_id) as  user_id, password from ${USER_TABLE} where username=? or email=?`;
    const values = [account, account];
    try {
        // Get pool connection from the database and create a user.
        poolConnection = yield db_1.db.getConnection();
        const [data,] = yield poolConnection.query(query, values);
        if (!data || (data === null || data === void 0 ? void 0 : data.length) < 1) {
            res.status(404).json({
                message: ERR_ACCOUNT_NOT_FOUND
            });
            return;
        }
        const passwordHash = data[0].password;
        const validPassword = yield (0, crypto_1.verifyPassword)(password, passwordHash);
        console.log(validPassword);
        if (!validPassword) {
            res.status(400).json({
                message: ERR_WRONG_PASSWORD
            });
            return;
        }
        user_id = data[0]["user_id"];
    }
    catch (error) {
        console.error(error);
        // An unknown error happened while performing a database operation.
        res.status(500).json({
            message: "An error has occured."
        });
        return;
    }
    finally {
        // We close the connection to the database, so other instances can use it.
        poolConnection === null || poolConnection === void 0 ? void 0 : poolConnection.release();
    }
    // Generate access token with the user_id
    const jwt = (0, auth_1.generateAccessToken)({ user_id: user_id });
    // Return jwt so the user can access protected endpoints, 201 as it was created.
    res.status(200).json({
        "token": `${jwt}`
    });
});
exports.LoginUser = LoginUser;
/**
 * Get the user statistics of a player.
 * @param  {[Request]} req [Express request]
 * @param  {[Response]} res [Express response]
 * @return {[void]}
 */
const GetUserStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `CALL GetUserGlobalStatistic(?);`;
    const user_id = req.params.username;
    console.log(user_id);
    // Declare poolConnection so we can close it in case something goes wrong.
    let poolConnection;
    try {
        // Get pool connection from the database and create a user.
        poolConnection = yield db_1.db.getConnection();
        const [data, _] = yield poolConnection.query(query, [user_id]);
        console.log(data);
        if (data[0].length == 0) {
            res.sendStatus(404);
            return;
        }
        // Operation succeded, return OK (200)
        res.status(200).json(data[0][0]);
        return;
    }
    catch (error) {
        // An Unkown Error happened in the database.
        console.log(error);
        res.status(500).json({
            message: "An error has occured."
        });
    }
    finally {
        // We close the connection to the database, so other instances can use it.
        poolConnection === null || poolConnection === void 0 ? void 0 : poolConnection.release();
    }
});
exports.GetUserStatistics = GetUserStatistics;
//# sourceMappingURL=UserController.js.map