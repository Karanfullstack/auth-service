import { Router } from 'express';
import TenantController from '../controllers/TenantController';
import { container } from '../config/inversify.config';
import { TYPES } from '../constants';
import tenantValidator from '../validators/tenant-validator';

const router = Router();
const tenantController = container.get<TenantController>(TYPES.TenantController);

router.post('/', tenantValidator, tenantController.create.bind(tenantController));

export default router;
