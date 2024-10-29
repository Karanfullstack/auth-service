import { FindOneOptions } from 'typeorm';
import { User } from '../../entity/User';
import { UserData } from '../../types';

export interface IAuthRepository {
   save(data: UserData): Promise<User>;
   findByEmail(email: string): Promise<User | null>;
   findOne(payload: FindOneOptions<User>): Promise<User | null>;
}
