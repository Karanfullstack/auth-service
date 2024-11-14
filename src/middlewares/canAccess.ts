import { NextFunction } from 'express';
import { AuthRequest } from '../types';
import createHttpError from 'http-errors';

const canAccess = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const roleFromToken = req.auth.role;
        if (!roles.includes(roleFromToken)) {
            const error = createHttpError(
                403,
                'You do not have permission to access this resource',
            );
            next(error);
            return;
        }
        next();
    };
};

export default canAccess;
