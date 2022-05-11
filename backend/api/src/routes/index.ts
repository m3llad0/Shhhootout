import express from "express"
import { CreateUser } from "../controllers/UserController"
const router = express.Router();

// User Routes


// auth register
// auth login

router.post('/user', CreateUser)


export default router;