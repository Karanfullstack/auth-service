import express, { RequestHandler } from 'express';
import { container } from '../config/inversify.config';
import AuthController from '../controllers/AuthController';
import { TYPES } from '../constants';
import registerValidator from '../validators/register-validator';
import loginValidator from '../validators/login-validator';
import authenticate from '../middlewares/authenticate';
import validateRefreshToken from '../middlewares/validateRefreshToken';

const router = express.Router();

const authController = container.get<AuthController>(TYPES.AuthController);

router.post('/register', registerValidator, authController.register.bind(authController));
router.post('/login', loginValidator, authController.login.bind(authController));

// @Protected Routes
router.get(
   '/self',
   authenticate,
   authController.self.bind(authController) as unknown as RequestHandler,
);

// @Protected Route
router.post(
   '/refresh',
   validateRefreshToken,
   authController.refresh.bind(authController) as unknown as RequestHandler,
);
export default router;
