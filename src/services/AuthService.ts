import { inject, injectable } from 'inversify';
import { UserData } from '../types';
import { IAuthService } from './Interfaces/IAuthService';
import { IAuthRepository } from '../repository/Interfaces/IAuthRepoistory';
import { User } from '../entity/User';
import { TYPES } from '../constants';
import createHttpError from 'http-errors';
import CredentialService from './CredentialService';

@injectable()
class AuthService implements IAuthService {
   private authRepository: IAuthRepository;
   private credentialService: CredentialService;
   constructor(
      @inject(TYPES.AuthRepository) authRepository: IAuthRepository,
      @inject(TYPES.CredentialService) credentialService: CredentialService,
   ) {
      this.authRepository = authRepository;
      this.credentialService = credentialService;
   }
   // Register a new user
   async create({ firstName, lastName, password, email, role }: UserData): Promise<User> {
      const user = await this.authRepository.findByEmail(email);
      if (user) {
         const err = createHttpError(400, 'User already exists');
         throw err;
      }

      const hashed = await this.credentialService.generateHash(password);
      const newUser = new User();
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.password = hashed;
      newUser.email = email;
      newUser.role = role;

      return this.authRepository.save(newUser);
   }
   async login({ email, password }: UserData): Promise<User> {
      const user = await this.authRepository.findByEmail(email);

      if (!user) {
         const err = createHttpError(401, 'User does not exist');
         throw err;
      }
      const isMatch = await this.credentialService.compareHash(password, user.password);

      if (!isMatch) {
         const err = createHttpError(401, 'Invalid credentials');
         throw err;
      }

      return user;
   }
}

export default AuthService;
