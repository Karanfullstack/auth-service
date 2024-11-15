import { RequestHandler, Router } from 'express';
import TenantController from '../controllers/TenantController';
import { container } from '../config/inversify.config';
import { Roles, TYPES } from '../constants';
import tenantValidator from '../validators/tenant-validator';
import authenticate from '../middlewares/authenticate';
import canAccess from '../middlewares/canAccess';
import queryValidator from '../validators/query-validator';

const router = Router();
const tenantController = container.get<TenantController>(TYPES.TenantController);

router.post(
    '/',
    authenticate,
    canAccess([Roles.ADMIN]) as unknown as RequestHandler,
    tenantValidator,
    tenantController.create.bind(tenantController),
);

router.get('/', queryValidator, tenantController.getAll.bind(tenantController));

router.delete(
    '/:id',
    authenticate,
    canAccess([Roles.ADMIN]) as unknown as RequestHandler,
    tenantController.deleteOne.bind(tenantController),
);

export default router;
