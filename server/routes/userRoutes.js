import express from "express";
import { registerUser, loginUser, updateToken } from "../services/UserService.js";
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/token', updateToken);

export default router;