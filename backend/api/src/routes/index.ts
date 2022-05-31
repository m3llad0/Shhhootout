import express from "express"
import { CreateLevel, DeleteLevel, GetLevel, GetLevelStatistics, GetTrendingLevels, StarLevel, UpdateLevel } from "../controllers/LevelController";
import { RegisterUser, GetUserStatistics, LoginUser } from "../controllers/UserController"
import { authenticated } from "../middleware/auth";
// import { MailChimpSendEmail } from "../shared/email/mailchimp";
const router = express.Router();

// User Routes
router.post('/register', RegisterUser)
router.post('/login', LoginUser)

//  Level routes
router.post('/level', authenticated(), CreateLevel)
router.get('/level',  GetLevel)
router.put('/level',authenticated(),  UpdateLevel)
router.delete('/level',authenticated(),  DeleteLevel)

router.post('/level/:id/star', authenticated(), StarLevel)
router.get('/level/trend', GetTrendingLevels)

// Statistics
router.get('/statistics/user/:id', GetUserStatistics)
router.get('/statistics/level/:id',  GetLevelStatistics)

export default router;

