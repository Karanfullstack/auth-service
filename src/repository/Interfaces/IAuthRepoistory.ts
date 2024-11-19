import { FindOneOptions, SelectQueryBuilder } from 'typeorm';
import { User } from '../../entity/User';
import { IUpdateUser, UserData } from '../../types';

export interface IAuthRepository {
    save(data: UserData): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findOne(payload: FindOneOptions<User>): Promise<User | null>;
    findByID(id: number): Promise<User | null>;
    deleteByID(id: number): Promise<User | null>;
    queryBuilder(user: string): Promise<SelectQueryBuilder<User>>;
    update(id: number, user: IUpdateUser): Promise<User | null>;
}
