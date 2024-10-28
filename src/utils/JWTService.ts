import { injectable } from 'inversify';
import { JwtServiceI } from '../types/index';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

@injectable()
class JwtService implements JwtServiceI {
   private readonly secret: Buffer;
   constructor() {
      this.secret = readFileSync(path.join(__dirname, '../../certs/private.pem'));
   }
   signToken(payload: JwtPayload): string {
      return jwt.sign(payload, this.secret, {
         algorithm: 'RS256',
         issuer: 'auth-service',
         expiresIn: '1h',
      });
   }
   verifytoken(token: string): JwtPayload {
      try {
         return jwt.verify(token, this.secret) as JwtPayload;
      } catch (error) {
         const err = createHttpError(500, 'Token verification failed');
         throw err;
      }
   }
   decodeToken(token: string): JwtPayload {
      try {
         return jwt.decode(token) as JwtPayload;
      } catch (error) {
         const err = createHttpError(500, 'Token decoded failed');
         throw err;
      }
   }
}
export default JwtService;
