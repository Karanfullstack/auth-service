import { Request, Response } from 'express';
export interface UserData {
   firstName: string;
   lastName: string;
   email: string;
   password: string;
}
interface RegistgerRequest extends Request {
   body: UserData;
}
class AuthController {
   register(req: RegistgerRequest, res: Response) {
      res.status(201).json();
   }
}

export default AuthController;
