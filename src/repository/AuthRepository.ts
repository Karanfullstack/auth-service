import { injectable } from 'inversify';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import { AuthRepositoryI, UserData } from '../types';
import { FindOneOptions } from 'typeorm';

@injectable()
class AuthRepository implements AuthRepositoryI {
   async save(data: UserData): Promise<User> {
      const userRepository = AppDataSource.getRepository(User);
      return await userRepository.save(data);
   }
   async findByEmail(email: string): Promise<User | null> {
      const userRepository = AppDataSource.getRepository(User);
      return await userRepository.findOneBy({ email });
   }
   async findOne(payload: FindOneOptions<User>): Promise<User | null> {
      const userRepository = AppDataSource.getRepository(User);
      return await userRepository.findOne(payload);
   }
}

export default AuthRepository;
