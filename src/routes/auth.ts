import express from 'express';
import AuthController from '../controllers/AuthController';

const router = express.Router();
const authControlleer = new AuthController();
router.get('/register', authControlleer.register.bind(authControlleer));

export default router;
