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

// Utils
