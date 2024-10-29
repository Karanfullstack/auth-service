import { injectable } from 'inversify';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { Config } from '../config';

@injectable()
class JwtService {
   private static readonly secret: Buffer = readFileSync(
      path.join(__dirname, '../../certs/private.pem'),
   );
   private static refreshTokenSecret = Config.REFRESH_TOKEN_SECRET as string;

   static signToken(payload: JwtPayload): string {
      return jwt.sign(payload, this.secret, {
         algorithm: 'RS256',
         expiresIn: Config.EXPIRES_DATE_TOKEN as string,
         issuer: Config.ISSUER_TOKEN as string,
      });
   }

   static verifyToken(token: string): JwtPayload {
      try {
         return jwt.verify(token, this.secret) as JwtPayload;
      } catch (error) {
         const err = createHttpError(500, 'Token verification failed');
         throw err;
      }
   }

   static decodeToken(token: string): JwtPayload {
      try {
         return jwt.decode(token) as JwtPayload;
      } catch (error) {
         const err = createHttpError(500, 'Token decoding failed');
         throw err;
      }
   }

   static refreshToken(payload: JwtPayload): string {
      return jwt.sign(payload, this.refreshTokenSecret, {
         algorithm: 'HS256',
         expiresIn: Config.EXPIRES_DATE_TOKEN as string,
         issuer: Config.ISSUER_TOKEN as string,
      });
   }
}

export default JwtService;
