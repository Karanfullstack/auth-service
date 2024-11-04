import { Request } from 'express';
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
export interface LoginRequest extends Request {
   body: Pick<UserData, 'email' | 'password'>;
}

export interface RegisterResponse extends User {
   success: boolean;
}

export interface AuthRequest extends Request {
   auth: {
      sub: string;
      role: string;
   };
}

export interface AuthCookie {
   accessToken: string;
}
