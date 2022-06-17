"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LevelController_1 = require("../controllers/LevelController");
const SessionController_1 = require("../controllers/SessionController");
const UserController_1 = require("../controllers/UserController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// User Routes
router.post('/register', UserController_1.RegisterUser);
router.post('/login', UserController_1.LoginUser);
//  Level routes
router.post('/level', (0, auth_1.authenticated)(), LevelController_1.CreateLevel);
router.get('/level/:id', LevelController_1.GetLevel);
router.get('/level', (0, auth_1.authenticated)(), LevelController_1.GetLevels);
router.put('/level/:id', (0, auth_1.authenticated)(), LevelController_1.UpdateLevel);
router.delete('/level/:id', (0, auth_1.authenticated)(), LevelController_1.DeleteLevel);
router.post('/level/:id/interact', (0, auth_1.authenticated)(), LevelController_1.InteractLevel);
router.get('/levels/trend', LevelController_1.GetTrendingLevels);
router.post('/score', (0, auth_1.authenticated)(), SessionController_1.CreateScore);
router.post('/session', (0, auth_1.authenticated)(), SessionController_1.CreateSession);
router.put('/session', (0, auth_1.authenticated)(), SessionController_1.UpdateSession);
// Statistics
router.get('/statistics/user/:username', UserController_1.GetUserStatistics);
router.get('/statistics/level/:id', LevelController_1.GetLevelStatistics);
exports.default = router;
//# sourceMappingURL=index.js.map