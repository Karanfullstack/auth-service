import { inject, injectable } from 'inversify';
import { AuthRepositoryI, AuthServiceI, TYPES, UserData } from '../types';
import { User } from '../entity/User';

@injectable()
class AuthService implements AuthServiceI {
   private authRepository: AuthRepositoryI;
   constructor(@inject(TYPES.AuthRepository) authRepository: AuthRepositoryI) {
      this.authRepository = authRepository;
   }
   async create({ firstName, lastName, password, email }: UserData): Promise<User> {
      return await this.authRepository.save({ firstName, lastName, password, email });
   }
}

export default AuthService;
