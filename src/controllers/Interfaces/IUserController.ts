import { NextFunction, Response } from 'express';
import { IUserCreateRequest } from '../../types';

export interface IUserController {
    create(req: IUserCreateRequest, res: Response, next: NextFunction): Promise<void>;
    // update(req: Request, res: Response): void;
    // delete(req: Request, res: Response): void;
    // get(req: Request, res: Response): void;
    // getAll(req: Request, res: Response): void;
}
