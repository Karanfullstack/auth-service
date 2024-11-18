import { Config } from '../config';

export const TYPES = {
    AuthService: Symbol.for('AuthService'),
    AuthRepository: Symbol.for('AuthRepository'),
    AuthController: Symbol.for('AuthController'),
    JWTService: Symbol.for('JWTService'),
    TokenService: Symbol.for('TokenService'),
    RefreshTokenRepository: Symbol.for('RefreshTokenRepository'),
    UserRepository: Symbol.for('UserRepository'),
    CredentialService: Symbol.for('CredentialService'),
    TenantRepo: Symbol.for('TenanRepo'),
    TenantRepository: Symbol.for('TenantRepository'),
    TenantController: Symbol.for('TenantController'),
    TenantService: Symbol.for('TenantService'),
    UserController: Symbol.for('UserController'),
};

export const Roles = {
    CUSTOMER: 'customer',
    ADMIN: 'admin',
    MANAGER: 'manager',
} as const;

export const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365; //  1 year
export const MS_IN_2DAYS = 1000 * 60 * 60 * 24 * 2; // 2 days

export const COOKIES_CONFIG = {
    domain: Config.HOST,
    sameSite: 'strict',
    maxAge: MS_IN_YEAR,
    httpOnly: true,
} as const;
