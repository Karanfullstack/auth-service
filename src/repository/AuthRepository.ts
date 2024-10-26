import { injectable } from 'inversify';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import { AuthRepositoryI, UserData } from '../types';

@injectable()
class AuthRepository implements AuthRepositoryI {
   async save(data: UserData): Promise<User> {
      const userRepository = AppDataSource.getRepository(User);
      return await userRepository.save(data);
   }
}

export default AuthRepository;
