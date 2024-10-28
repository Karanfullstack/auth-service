import { NextFunction, Request, Response } from 'express';
import { User } from '../entity/User';
import { FindOneOptions } from 'typeorm';
import { JwtPayload } from 'jsonwebtoken';

export interface UserData {
   firstName: string;
   lastName: string;
   email: string;
   password: string;
   role: string;
}
export interface RegistgerRequest extends Request {
   body: Omit<UserData, 'role' | 'id'>;
}

export interface RegisterResponse extends User {
   success: boolean;
}

export interface AuthRepositoryI {
   save(data: UserData): Promise<User>;
   findByEmail(email: string): Promise<User | null>;
   findOne(payload: FindOneOptions<User>): Promise<User | null>;
}
export interface AuthServiceI {
   create(data: UserData): Promise<User>;
   signToken(payload: JwtPayload): string;
   verifytoken(token: string): JwtPayload;
   decodeToken(token: string): JwtPayload;
}
export interface AuthControllerI {
   register(req: RegistgerRequest, res: Response, next: NextFunction): Promise<void>;
}

// Utils

export interface JwtServiceI {
   signToken(payload: JwtPayload): string;
   verifytoken(token: string): JwtPayload;
   decodeToken(token: string): JwtPayload;
}
