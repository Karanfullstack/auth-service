import { inject, injectable } from 'inversify';
import { FindOneOptions, QueryBuilder, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../entity/User';
import { IUpdateUser, UserData } from '../types';
import { IAuthRepository } from './Interfaces/IAuthRepoistory';
import { TYPES } from '../constants';

@injectable()
class AuthRepository implements IAuthRepository {
    constructor(@inject(TYPES.UserRepository) private userRepository: Repository<User>) {}
    async save(data: UserData): Promise<User> {
        return await this.userRepository.save(data);
    }
    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOneBy({ email });
    }
    async findOne(payload: FindOneOptions<User>): Promise<User | null> {
        return await this.userRepository.findOne(payload);
    }
    async findByID(id: number): Promise<User | null> {
        return await this.userRepository.findOneBy({ id });
    }
    async deleteByID(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: id } });
        if (!user) {
            throw new Error('User id is not valid to be deleted');
        }
        await this.userRepository.delete(id);
        return user;
    }

    async queryBuilder(user: string): Promise<SelectQueryBuilder<User>> {
        return this.userRepository.createQueryBuilder(user);
    }

    async update(id: number, user: IUpdateUser): Promise<User | null> {
        const payload = await this.userRepository.findOne({ where: { id: id } });
        if (!user) {
            throw new Error('User id is not valid to be deleted');
        }
        await this.userRepository.update(id, user);
        return payload;
    }
}

export default AuthRepository;
