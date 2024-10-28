import { NextFunction, Response } from 'express';
import { AuthControllerI, AuthServiceI, RegistgerRequest } from '../types';
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { Roles, TYPES } from '../constants';
import { validationResult } from 'express-validator';

@injectable()
class AuthController implements AuthControllerI {
   private authService: AuthServiceI;
   private logger: Logger;
   constructor(
      @inject(TYPES.AuthService) authService: AuthServiceI,
      @inject(TYPES.Logger) logger: Logger,
   ) {
      this.authService = authService;
      this.logger = logger;
   }
   async register(req: RegistgerRequest, res: Response, next: NextFunction) {
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

         // set cookies
         const accessToken = this.authService.signToken({
            sub: String(user.id),
            role: user.role,
         });
         const refreshToken = 'efeeefefe';

         res.cookie('accessToken', accessToken, {
            domain: 'localhost',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
         }).cookie('refreshToken', refreshToken, {
            domain: 'localhost',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
         });

         res.status(201).json({ id: user.id, success: true });
      } catch (error) {
         return next(error);
      }
   }
}

export default AuthController;
