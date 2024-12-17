import { NextFunction, Request, Response } from 'express';
import { matchedData, validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { inject, injectable } from 'inversify';
import logger from '../config/logger';
import { TYPES } from '../constants';
import { ITenantService } from '../services/Interfaces/ITenantService';
import { CreateTenantRequest, ITeanantQuery } from '../types';
import { ITenantController } from './Interfaces/ITenantConroller';

@injectable()
class TenantController implements ITenantController {
    constructor(@inject(TYPES.TenantService) private tenantService: ITenantService) {}

    async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
        const { name, address } = req.body;
        const result = validationResult(req);
        if (!result.isEmpty()) {
            const err = createHttpError(400, result.array()[0].msg as string);
            return next(err);
        }
        logger.debug('Request for creating tenant', { name, address });
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

        logger.debug('Request for getting all tenants', validate);
        try {
            const [tenants, count] = await this.tenantService.getAll(validate as ITeanantQuery);
            res.json({
                success: true,
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

        if (isNaN(Number(id))) {
            const err = createHttpError(400, 'Invalid request id');
            next(err);
            return;
        }

        logger.debug('Request for deleting tenant', { id });
        try {
            await this.tenantService.deleteOne(Number(id));
            logger.info('Tenant deleted');
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    }

    async updateOne(req: CreateTenantRequest, res: Response, next: NextFunction): Promise<void> {
        const id = req.params.id;
        if (isNaN(Number(id))) {
            const err = createHttpError(400, 'Invalid request id must be an integer');
            return next(err);
        }

        const result = validationResult(req);
        if (!result.isEmpty()) {
            const err = createHttpError(400, result.array()[0].msg as string);
            return next(err);
        }
        const { name, address } = req.body;
        logger.debug('Request for updating tenant', { id, name, address });
        try {
            const updated = await this.tenantService.updateOne(Number(id), { name, address });
            logger.info('Tenant updated', updated);
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = req.params.id;

        if (isNaN(Number(id))) {
            const err = createHttpError(400, 'Invalid request id');
            return next(err);
        }
        logger.debug('Request for getting a single tenant', { id });
        try {
            const tenant = await this.tenantService.getOne(Number(id));
            logger.info('Tenant fetched', tenant);
            res.json({ id: tenant.id, name: tenant.name, address: tenant.address });
        } catch (error) {
            next(error);
        }
    }
}

export default TenantController;
