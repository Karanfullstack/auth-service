import { Config } from '../config';

export const TYPES = {
   AuthService: Symbol.for('AuthService'),
   AuthRepository: Symbol.for('AuthRepository'),
   AuthController: Symbol.for('AuthController'),
   Logger: Symbol.for('Logger'),
   JWTService: Symbol.for('JWTService'),
   TokenService: Symbol.for('TokenService'),
   RefreshTokenRepository: Symbol.for('RefreshTokenRepository'),
   UserRepository: Symbol.for('UserRepository'),
};

export const Roles = {
   CUSTOMER: 'customer',
   ADMIN: 'admin',
   MANAGER: 'manager',
} as const;

export const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365; // 7 days

export const COOKIES_CONFIG = {
   domain: Config.HOST,
   sameSite: 'strict',
   maxAge: MS_IN_YEAR,
   httpOnly: true,
} as const;
