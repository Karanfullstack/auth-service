import { inject, injectable } from 'inversify';
import { AuthRepositoryI, AuthServiceI, TYPES, UserData } from '../types';

@injectable()
class AuthService implements AuthServiceI {
   private authRepository: AuthRepositoryI;
   constructor(@inject(TYPES.AuthRepository) authRepository: AuthRepositoryI) {
      this.authRepository = authRepository;
   }
   async create({ firstName, lastName, password, email }: UserData) {
      await this.authRepository.save({ firstName, lastName, password, email });
   }
}

export default AuthService;
