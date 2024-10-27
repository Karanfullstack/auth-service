import express from 'express';
import { container } from '../config/inversify.config';
import AuthController from '../controllers/AuthController';
import { TYPES } from '../constants';
import registerValidator from '../validators/register-validator';
const router = express.Router();

const authController = container.get<AuthController>(TYPES.AuthController);
router.get('/register', authController.register.bind(authController));
router.post('/register', registerValidator, authController.register.bind(authController));

export default router;
