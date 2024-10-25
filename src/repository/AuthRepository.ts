import { injectable } from 'inversify';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import { AuthRepositoryI, UserData } from '../types';

@injectable()
class AuthRepository implements AuthRepositoryI {
   async save(data: UserData): Promise<void> {
      const userRepository = AppDataSource.getRepository(User);
      await userRepository.save(data);
   }
}

export default AuthRepository;
