import { NextFunction, Response } from 'express';
import { RegistgerRequest } from '../../types';

export interface IAuthController {
   register(req: RegistgerRequest, res: Response, next: NextFunction): Promise<void>;
}
