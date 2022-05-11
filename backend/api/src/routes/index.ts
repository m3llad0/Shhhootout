import express from "express"
import { GetTrendingLevels } from "../controllers/LevelController";
import { CreateUser } from "../controllers/UserController"
const router = express.Router();

// User Routes


// auth register
// auth login

router.post('/user', CreateUser)


// router.post('/level', CreateLevel)
// router.get('/level',  GetLevel)
// router.put('/level',  UpdateLevel)
// router.put('/level',  DeleteLevel)

router.get('/level/trend',  GetTrendingLevels)

export default router;