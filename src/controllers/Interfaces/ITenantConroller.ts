import { CreateTenantRequest } from '../../types';
import { Response, NextFunction } from 'express';

export interface ITenantController {
    create(req: CreateTenantRequest, res: Response, next: NextFunction): Promise<void>;
}
