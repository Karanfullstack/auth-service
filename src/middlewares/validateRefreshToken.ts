import { Request, RequestHandler } from 'express';
import { expressjwt } from 'express-jwt';

import { Config } from '../config';
import { AuthCookie, IRefreshTokenPayload } from '../types';
import { AppDataSource } from '../config/data-source';
import { RefreshToken } from '../entity/RefreshToken';
import logger from '../config/logger';

export default expressjwt({
    secret: Config.REFRESH_TOKEN_SECRET as string,
    algorithms: ['HS256'],
    getToken: (req: Request) => {
        const { refreshToken } = req.cookies as AuthCookie;
        return refreshToken;
    },
    async isRevoked(req: Request, token) {
        try {
            const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);
            const refreshToken = await refreshTokenRepo.findOne({
                where: {
                    id: Number((token?.payload as unknown as IRefreshTokenPayload).jti),
                    user: { id: Number(token?.payload.sub) },
                },
            });

            return refreshToken === null;
        } catch (error) {
            logger.info('Error while getting RefreshToken in middleware');
            return true;
        }
    },
}) as RequestHandler;
