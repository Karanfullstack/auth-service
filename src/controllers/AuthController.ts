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
      // validate request
      const result = validationResult(req);
      if (!result.isEmpty()) {
         res.status(400).json({ errors: result.array() });
         return;
      }

      const { firstName, lastName, password, email } = req.body;

      // logger debug
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

         res.status(201).json({ id: user.id, success: true });
      } catch (error) {
         return next(error);
      }
   }
}

export default AuthController;
