import { inject, injectable } from 'inversify';
import { AuthRepositoryI, AuthServiceI, JwtServiceI, UserData } from '../types';
import { User } from '../entity/User';
import { TYPES } from '../constants';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { Config } from '../config';
import { JwtPayload } from 'jsonwebtoken';
@injectable()
class AuthService implements AuthServiceI {
   private authRepository: AuthRepositoryI;
   private jwtService: JwtServiceI;
   constructor(
      @inject(TYPES.AuthRepository) authRepository: AuthRepositoryI,
      @inject(TYPES.JWTService) jwtService: JwtServiceI,
   ) {
      this.authRepository = authRepository;
      this.jwtService = jwtService;
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

   signToken(payload: object): string {
      return this.jwtService.signToken(payload);
   }

   verifytoken(token: string): JwtPayload {
      return this.jwtService.verifytoken(token);
   }

   decodeToken(token: string): JwtPayload {
      return this.jwtService.decodeToken(token);
   }
}

export default AuthService;
