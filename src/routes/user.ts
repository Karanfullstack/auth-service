import { RequestHandler, Router } from 'express';
import { container } from '../config/inversify.config';
import UserController from '../controllers/UserController';
import { Roles, TYPES } from '../constants';
import authenticate from '../middlewares/authenticate';
import canAccess from '../middlewares/canAccess';
import userQueryValidator from '../validators/user-query-validator';
import updateUserValidator from '../validators/update-user-validator';
import createUserValidator from '../validators/create-user-validator';

const router = Router();
const userController = container.get<UserController>(TYPES.UserController);

// @PROTECTED
router.post(
    '/',
    authenticate,
    createUserValidator,
    canAccess([Roles.ADMIN]) as unknown as RequestHandler,
    userController.create.bind(userController),
);

// @PROTECTED
router.delete(
    '/:id',
    authenticate,
    canAccess([Roles.ADMIN]) as unknown as RequestHandler,
    userController.delete.bind(userController),
);

// @PROTECTED
router.get(
    '/:id',
    authenticate,
    canAccess([Roles.ADMIN]) as unknown as RequestHandler,
    userController.get.bind(userController),
);
// @PROTECTED
router.get(
    '/',
    authenticate,
    canAccess([Roles.ADMIN]) as unknown as RequestHandler,
    userQueryValidator,
    userController.getAll.bind(userController),
);

// @PROTECTED
router.patch(
    '/:id',
    authenticate,
    updateUserValidator,
    canAccess([Roles.ADMIN]) as unknown as RequestHandler,
    userController.update.bind(userController),
);

export default router;
