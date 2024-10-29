import { injectable } from 'inversify';
import { FindOneOptions, Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import { UserData } from '../types';
import { IAuthRepository } from './Interfaces/IAuthRepoistory';

@injectable()
class AuthRepository implements IAuthRepository {
   private userRepository: Repository<User>;
   constructor() {
      this.userRepository = AppDataSource.getRepository(User);
   }
   async save(data: UserData): Promise<User> {
      return await this.userRepository.save(data);
   }
   async findByEmail(email: string): Promise<User | null> {
      return await this.userRepository.findOneBy({ email });
   }
   async findOne(payload: FindOneOptions<User>): Promise<User | null> {
      return await this.userRepository.findOne(payload);
   }
}

export default AuthRepository;
