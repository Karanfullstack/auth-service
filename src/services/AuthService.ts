import { inject, injectable } from 'inversify';
import { UserData } from '../types';
import { IAuthService } from './Interfaces/IAuthService';
import { IAuthRepository } from '../repository/Interfaces/IAuthRepoistory';
import { User } from '../entity/User';
import { TYPES } from '../constants';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { Config } from '../config';

@injectable()
class AuthService implements IAuthService {
   private authRepository: IAuthRepository;
   constructor(@inject(TYPES.AuthRepository) authRepository: IAuthRepository) {
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
      const newUser = new User();
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.password = hashed;
      newUser.email = email;
      newUser.role = role;
      return this.authRepository.save(newUser);
   }
}

export default AuthService;
