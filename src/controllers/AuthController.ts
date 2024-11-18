import { NextFunction, Response } from 'express';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { inject, injectable } from 'inversify';
import { JwtPayload } from 'jsonwebtoken';
import logger from '../config/logger';
import { COOKIES_CONFIG, Roles, TYPES } from '../constants';
import { IAuthService } from '../services/Interfaces/IAuthService';
import TokenService from '../services/TokenService';
import { AuthRequest, LoginRequest, RegistgerRequest } from '../types';
import { IAuthController } from './Interfaces/IAuthController';

@injectable()
class AuthController implements IAuthController {
    private authService: IAuthService;
    private tokenService: TokenService;
    constructor(
        @inject(TYPES.AuthService) authService: IAuthService,
        @inject(TYPES.TokenService) tokenService: TokenService,
    ) {
        this.authService = authService;
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
        logger.debug('New request to register', {
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
            logger.info('User created successfully', { user: user.id });

            // saving refreshToken
            const newRefreshToken = await this.tokenService.persistRefreshToken(user);

            const payload: JwtPayload = {
                sub: String(user.id),
                name: user.firstName,
                lastName: user.lastName,
                tenant: user.tenant ? String(user.tenant.id) : '',
                email: user.email,
                role: user.role,
            };

            // @AccessToken and RefreshToken
            const accessToken = this.tokenService.generateAccessToken(payload);
            const refreshToken = this.tokenService.generateRefreshToken(
                payload,
                newRefreshToken.id,
            );

            // @SetCookies
            this.saveRefreshTokenCookie(refreshToken, res);
            this.saveAccessTokenCookie(accessToken, res);

            res.status(201).json({ ...user, password: undefined, success: true });
        } catch (error) {
            return next(error);
        }
    }

    async login(req: LoginRequest, res: Response, next: NextFunction): Promise<void> {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() });
            return;
        }
        const { email, password } = req.body;
        try {
            const user = await this.authService.login({ email, password });

            const payload: JwtPayload = {
                sub: String(user.id),
                name: user.firstName,
                lastName: user.lastName,
                tenant: user.tenant ? String(user.tenant.id) : '',
                email: user.email,
                role: user.role,
            };

            const newRefreshToken = await this.tokenService.persistRefreshToken(user);
            const accessToken = this.tokenService.generateAccessToken(payload);
            const refreshToken = this.tokenService.generateRefreshToken(
                payload,
                newRefreshToken.id,
            );

            //@SetCookies
            this.saveRefreshTokenCookie(refreshToken, res);
            this.saveAccessTokenCookie(accessToken, res);

            logger.info('User logged in successfully', { user: user.id });
            res.status(200).json({ ...user, password: undefined });
        } catch (error) {
            return next(error);
        }
    }

    // @PROTECTED
    async self(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await this.authService.self(Number(req.auth.sub));
            res.status(200).json({ ...user, password: undefined });
        } catch (error) {
            next(error);
        }
    }

    // @PROTECTED
    async refresh(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await this.authService.getUserById(Number(req.auth.sub));
            if (!user) {
                const error = createHttpError(404, 'User could not find user with refresh token.');
                logger.error('User could not find user with refresh token in refresh endpoint');
                return next(error);
            }
            const payload: JwtPayload = {
                sub: req.auth.sub,
                email: req.auth.email,
                tenant: req.auth.tenant,
                firstName: req.auth.firstName,
                lastName: req.auth.lastName,
                role: req.auth.role,
            };

            const persistRefreshToken = await this.tokenService.persistRefreshToken(user);
            logger.info('Refresh token persist with id', persistRefreshToken.id);

            const accessToken = this.tokenService.generateAccessToken(payload);
            logger.info('Generated access token', accessToken.slice(0, 10));
            const newRefreshToken = this.tokenService.generateRefreshToken(
                payload,
                persistRefreshToken.id,
            );
            logger.info('Generated new refresh token', accessToken.slice(0, 10));

            // @Delete Old Refresh Token
            await this.tokenService.deletePersitToken(req.auth.jti);
            logger.info('Old refresh token removed');

            // @Save tokens to cookies
            this.saveAccessTokenCookie(accessToken, res);
            this.saveRefreshTokenCookie(newRefreshToken, res);

            res.json({ success: true, refreshTokenID: Number(persistRefreshToken.id) });
        } catch (error) {
            next(error);
        }
    }

    // @PROTECTED
    async logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.tokenService.deletePersitToken(req.auth.jti);
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    }

    // @Set Cookies Methods
    saveAccessTokenCookie(accessToken: string, res: Response): void {
        res.cookie('accessToken', accessToken, COOKIES_CONFIG);
    }
    saveRefreshTokenCookie(refreshToken: string, res: Response): void {
        res.cookie('refreshToken', refreshToken, COOKIES_CONFIG);
    }
}

export default AuthController;
