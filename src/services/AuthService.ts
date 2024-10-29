import { inject, injectable } from 'inversify';
import { AuthRepositoryI, AuthServiceI, UserData } from '../types';
import { User } from '../entity/User';
import { TYPES } from '../constants';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { Config } from '../config';

@injectable()
class AuthService implements AuthServiceI {
   private authRepository: AuthRepositoryI;
   constructor(@inject(TYPES.AuthRepository) authRepository: AuthRepositoryI) {
      this.authRepository = authRepository;
   }

   // Register a new user
   async create({ firstName, lastName, password, email, role }: UserData): Promise<User> {
      const user = await this.authRepository.findByEmail(email);
      if (user) {
         const err = createHttpError(400, 'User already exists');
         throw err;
      }
      const salt = Number(Config.BCRYPT_SALT) || 10;
      const hashed = await bcrypt.hash(password, salt);
      return this.authRepository.save({
         firstName,
         lastName,
         password: hashed,
         email,
         role,
      });
   }
}

export default AuthService;
