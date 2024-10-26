import { NextFunction, Request, Response } from 'express';
import { User } from '../entity/User';

export interface UserData {
   firstName: string;
   lastName: string;
   email: string;
   password: string;
   role: string;
}
export interface RegistgerRequest extends Request {
   body: Omit<UserData, 'role'>;
}

export interface RegisterResponse extends User {
   success: boolean;
}

export interface AuthServiceI {
   create(data: UserData): Promise<User>;
}

export interface AuthRepositoryI {
   save(data: UserData): Promise<User>;
}

export interface AuthControllerI {
   register(req: RegistgerRequest, res: Response, next: NextFunction): Promise<void>;
}
