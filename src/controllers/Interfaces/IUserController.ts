import { NextFunction, Response, Request } from 'express';
import { IUserCreateRequest } from '../../types';

export interface IUserController {
    create(req: IUserCreateRequest, res: Response, next: NextFunction): Promise<void>;
    // update(req: Request, res: Response): void;
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
    get(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
}
