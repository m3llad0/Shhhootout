import express from "express"
import { CreateLevel, DeleteLevel, GetLevel, GetLevels, GetLevelStatistics, GetTrendingLevels, InteractLevel, UpdateLevel } from "../controllers/LevelController";
import { CreateScore, CreateSession, UpdateSession } from "../controllers/SessionController";
import { RegisterUser, GetUserStatistics, LoginUser } from "../controllers/UserController"
import { authenticated } from "../middleware/auth";
const router = express.Router();

// User Routes
router.post('/register', RegisterUser)
router.post('/login', LoginUser)

//  Level routes
router.post('/level', authenticated(), CreateLevel)
router.get('/level/:id',  GetLevel)
router.get('/level', authenticated(),  GetLevels)
router.put('/level/:id',authenticated(),  UpdateLevel)
router.delete('/level/:id',authenticated(),  DeleteLevel)

router.post('/level/:id/interact', authenticated(), InteractLevel)
router.get('/levels/trend', GetTrendingLevels)

router.post('/score', authenticated(), CreateScore)
router.post('/session', authenticated(), CreateSession)
router.put('/session', authenticated(), UpdateSession)

// Statistics
router.get('/statistics/user/:username', GetUserStatistics)
router.get('/statistics/level/:id',  GetLevelStatistics)

export default router;

