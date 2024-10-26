import { inject, injectable } from 'inversify';
import { AuthRepositoryI, AuthServiceI, UserData } from '../types';
import { User } from '../entity/User';
import { Roles, TYPES } from '../constants';

@injectable()
class AuthService implements AuthServiceI {
   private authRepository: AuthRepositoryI;
   constructor(@inject(TYPES.AuthRepository) authRepository: AuthRepositoryI) {
      this.authRepository = authRepository;
   }
   async create({ firstName, lastName, password, email, role }: UserData): Promise<User> {
      return await this.authRepository.save({
         firstName,
         lastName,
         password,
         email,
         role,
      });
   }
}

export default AuthService;
