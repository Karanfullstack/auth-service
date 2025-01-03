import { Tenant } from '../../entity/Tenant';
import { CreateTenantRequest } from '../../types';
import { Response, NextFunction, Request } from 'express';

export interface ITenantController {
    create(req: CreateTenantRequest, res: Response, next: NextFunction): Promise<void>;
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteOne(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateOne(req: Request, res: Response, next: NextFunction): Promise<void>;
    getOne(req: Request, res: Response, next: NextFunction): Promise<void>;
}
