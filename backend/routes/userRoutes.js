import express from 'express';
import { createUser, signup, login, updateUser, getUser } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/user', verifyToken, getUser);
router.put('/user', verifyToken, updateUser);

export default router; 