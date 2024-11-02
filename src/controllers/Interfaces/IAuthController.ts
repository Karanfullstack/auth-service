import { NextFunction, Response } from 'express';
import { LoginRequest, RegistgerRequest } from '../../types';

export interface IAuthController {
   register(req: RegistgerRequest, res: Response, next: NextFunction): Promise<void>;
   login(req: LoginRequest, res: Response, next: NextFunction): Promise<void>;
}
