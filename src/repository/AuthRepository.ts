import { inject, injectable } from 'inversify';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from '../entity/User';
import { UserData } from '../types';
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
}

export default AuthRepository;
