import { NextFunction, Request, Response } from 'express';
import { AuthRequest, LoginRequest, RegistgerRequest } from '../../types';

export interface IAuthController {
   register(req: RegistgerRequest, res: Response, next: NextFunction): Promise<void>;
   login(req: LoginRequest, res: Response, next: NextFunction): Promise<void>;
   self(req: Request, res: Response, next: NextFunction): Promise<void>;
}
