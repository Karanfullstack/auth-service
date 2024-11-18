import { RequestHandler, Router } from 'express';
import { container } from '../config/inversify.config';
import UserController from '../controllers/UserController';
import { Roles, TYPES } from '../constants';
import authenticate from '../middlewares/authenticate';
import canAccess from '../middlewares/canAccess';

const router = Router();
const userController = container.get<UserController>(TYPES.UserController);

router.post(
    '/',
    authenticate,
    canAccess([Roles.ADMIN]) as unknown as RequestHandler,
    userController.create.bind(userController),
);

export default router;
