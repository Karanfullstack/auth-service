import { NextFunction, Response } from 'express';
import { validationResult } from 'express-validator';
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { COOKIES_CONFIG, Roles, TYPES } from '../constants';
import { IAuthService } from '../services/Interfaces/IAuthService';
import TokenService from '../services/TokenService';
import { RegistgerRequest } from '../types';
import { IAuthController } from './Interfaces/IAuthController';

@injectable()
class AuthController implements IAuthController {
   private authService: IAuthService;
   private logger: Logger;
   private tokenService: TokenService;
   constructor(
      @inject(TYPES.AuthService) authService: IAuthService,
      @inject(TYPES.Logger) logger: Logger,
      @inject(TYPES.TokenService) tokenService: TokenService,
   ) {
      this.authService = authService;
      this.logger = logger;
      this.tokenService = tokenService;
   }
   async register(req: RegistgerRequest, res: Response, next: NextFunction): Promise<void> {
      // @VALIDATE REQUEST
      const result = validationResult(req);
      if (!result.isEmpty()) {
         res.status(400).json({ errors: result.array() });
         return;
      }

      // @BODY
      const { firstName, lastName, password, email } = req.body;

      // @LOGGER DUBUG
      this.logger.debug('New request to register', {
         firstName,
         lastName,
         email,
         password: '***',
      });

      try {
         const user = await this.authService.create({
            firstName,
            lastName,
            password,
            email,
            role: Roles.CUSTOMER,
         });

         // logger
         this.logger.info('User created successfully', { user: user.id });

         // saving refreshToken
         const newRefreshToken = await this.tokenService.persistRefreshToken(user);

         const payload = { sub: String(user.id), role: user.role };

         // @AccessToken and RefreshToken
         const accessToken = this.tokenService.generateAccessToken(payload);
         const refreshToken = this.tokenService.generateRefreshToken(payload, newRefreshToken.id);

         // @SetCookies
         res.cookie('accessToken', accessToken, COOKIES_CONFIG);
         res.cookie('refreshToken', refreshToken, COOKIES_CONFIG);

         res.status(201).json({ ...user, success: true });
      } catch (error) {
         return next(error);
      }
   }
}

export default AuthController;
