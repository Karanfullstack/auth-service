import { Response } from 'express';
import { AuthControllerI, AuthServiceI, RegistgerRequest, TYPES } from '../types';
import { inject, injectable } from 'inversify';

@injectable()
class AuthController implements AuthControllerI {
   private authService: AuthServiceI;
   constructor(@inject(TYPES.AuthService) authService: AuthServiceI) {
      this.authService = authService;
   }
   async register(req: RegistgerRequest, res: Response) {
      const { firstName, lastName, password, email } = req.body;
      await this.authService.create({ firstName, lastName, password, email });
      res.status(201).json();
   }
}

export default AuthController;
