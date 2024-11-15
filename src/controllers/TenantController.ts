import { NextFunction, Response, Request } from 'express';
import { CreateTenantRequest, ITeanantQuery } from '../types';
import { inject, injectable } from 'inversify';
import { TYPES } from '../constants';
import { ITenantService } from '../services/Interfaces/ITenantService';
import { ITenantController } from './Interfaces/ITenantConroller';
import { matchedData, validationResult } from 'express-validator';
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

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        const validate = matchedData(req, { onlyValidData: true });

        try {
            const [tenants, count] = await this.tenantService.getAll(validate as ITeanantQuery);
            res.json({
                currentPage: validate.currentPage as number,
                perPage: validate.perPage as number,
                total: count,
                data: tenants,
            });
            logger.info('Tenants Fetched', tenants);
        } catch (error) {
            next(error);
        }
    }

    async deleteOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = req.params.id;
        try {
            await this.tenantService.deleteOne(Number(id));
            logger.info('Tenant deleted');
            res.status(204).json();
        } catch (error) {
            next(error);
        }
    }
}

export default TenantController;
