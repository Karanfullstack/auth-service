import { Request, Response } from 'express';

export interface UserData {
   firstName: string;
   lastName: string;
   email: string;
   password: string;
}
export interface RegistgerRequest extends Request {
   body: UserData;
}

export interface AuthServiceI {
   create(data: UserData): Promise<void>;
}

export interface AuthRepositoryI {
   save(data: UserData): Promise<void>;
}

export interface AuthControllerI {
   register(req: RegistgerRequest, res: Response): Promise<void>;
}

export const TYPES = {
   AuthService: Symbol.for('AuthService'),
   AuthRepository: Symbol.for('AuthRepository'),
   AuthController: Symbol.for('AuthController'),
};
