import { NextFunction, Response } from 'express';
import { CreateTenantRequest } from '../types';
import { inject, injectable } from 'inversify';
import { TYPES } from '../constants';
import { ITenantService } from '../services/Interfaces/ITenantService';
import { ITenantController } from './Interfaces/ITenantConroller';
import { validationResult } from 'express-validator';
import logger from '../config/logger';

@injectable()
class TenantController implements ITenantController {
    constructor(@inject(TYPES.TenantService) private tenantService: ITenantService) {}

    async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
        const { name, address } = req.body;
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() });
            return;
        }
        try {
            const tenant = await this.tenantService.create({ name, address });
            logger.info(`Tenant created: ${tenant.id}`);
            res.status(201).json({ id: tenant.id });
        } catch (error) {
            next(error);
        }
    }
}

export default TenantController;
