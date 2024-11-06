import { User } from '../../entity/User';
import { UserData } from '../../types';
import { Response } from 'express';
export interface IAuthService {
   create(data: UserData): Promise<User>;
   login(data: Pick<UserData, 'email' | 'password'>): Promise<User>;
   self(id: number): Promise<User>;
   getUserById(id: number): Promise<User | null>;
}
