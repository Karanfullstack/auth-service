import createHttpError from 'http-errors';
import { inject, injectable } from 'inversify';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { Config } from '../config';
import { MS_IN_2DAYS, MS_IN_YEAR, TYPES } from '../constants';
import { RefreshToken } from '../entity/RefreshToken';
import { User } from '../entity/User';

@injectable()
class TokenService {
    private readonly privateKey: string;
    private refreshTokenSecret = Config.REFRESH_TOKEN_SECRET as string;

    constructor(
        @inject(TYPES.RefreshTokenRepository)
        private RefreshTokenRepository: Repository<RefreshToken>,
    ) {
        this.privateKey = Config.PRIVATE_KEY as string;
    }

    generateAccessToken(payload: JwtPayload): string {
        try {
            const accessToken = jwt.sign(payload, this.privateKey, {
                algorithm: 'RS256',
                expiresIn: MS_IN_2DAYS,
                issuer: Config.ISSUER_TOKEN as string,
            });
            return accessToken;
        } catch (error) {
            const err = createHttpError(500, 'Error while creaing accessToken');
            throw err;
        }
    }

    verifyAccesstoken(token: string): JwtPayload {
        try {
            const payload = jwt.verify(token, this.privateKey);
            return payload as JwtPayload;
        } catch (error) {
            const err = createHttpError(500, 'Error while verifying accessToken');
            throw err;
        }
    }

    generateRefreshToken(payload: JwtPayload, jwtID: number): string {
        try {
            const refreshToken = jwt.sign(payload, this.refreshTokenSecret, {
                algorithm: 'HS256',
                expiresIn: Config.EXPIRES_DATE_TOKEN as string,
                issuer: Config.ISSUER_TOKEN as string,
                jwtid: String(jwtID),
            });
            return refreshToken;
        } catch (error) {
            const err = createHttpError(500, 'Error while creating refreshToken');
            throw err;
        }
    }

    verifyRefreshToken(refreshToken: string): JwtPayload {
        try {
            const decodedRefreshToken = jwt.verify(refreshToken, this.refreshTokenSecret);
            return decodedRefreshToken as JwtPayload;
        } catch (error) {
            const err = createHttpError(500, 'Error while verifying refreshToken');
            throw err;
        }
    }

    async persistRefreshToken(user: User) {
        try {
            const newRefreshToken = await this.RefreshTokenRepository.save({
                user,
                expiresAt: new Date(Date.now() + MS_IN_YEAR),
            });
            return newRefreshToken;
        } catch (error) {
            const err = createHttpError(500, 'Error while saving RefreshToken in databse');
            throw err;
        }
    }
    async deletePersitToken(id: string): Promise<void> {
        try {
            await this.RefreshTokenRepository.delete({ id: Number(id) });
        } catch (error) {
            const err = createHttpError(500, 'Error while deleting refresh token');
            throw err;
        }
    }
}

export default TokenService;
