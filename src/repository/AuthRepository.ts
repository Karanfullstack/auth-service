import { injectable } from 'inversify';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import { AuthRepositoryI, UserData } from '../types';
import { FindOneOptions } from 'typeorm';

@injectable()
class AuthRepository implements AuthRepositoryI {
   private userRepository = AppDataSource.getRepository(User);
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
