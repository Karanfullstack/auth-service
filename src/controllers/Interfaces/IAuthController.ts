import { NextFunction, Request, Response } from 'express';
import { LoginRequest, RegistgerRequest } from '../../types';

export interface IAuthController {
   register(req: RegistgerRequest, res: Response, next: NextFunction): Promise<void>;
   login(req: LoginRequest, res: Response, next: NextFunction): Promise<void>;
   self(req: Request, res: Response, next: NextFunction): Promise<void>;
   refresh(req: Request, res: Response, next: NextFunction): Promise<void>;
   logout(req: Request, res: Response, next: NextFunction): Promise<void>;
   saveAccessTokenCookie(accessToken: string, res: Response): void;
   saveRefreshTokenCookie(refreshToken: string, res: Response): void;
}
