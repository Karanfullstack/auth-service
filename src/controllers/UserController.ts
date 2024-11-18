import { inject, injectable } from 'inversify';
import { IUserController } from './Interfaces/IUserController';
import { TYPES } from '../constants';
import { IAuthService } from '../services/Interfaces/IAuthService';
import { IUserCreateRequest } from '../types';
import { NextFunction, Response } from 'express';
import logger from '../config/logger';

@injectable()
class UserController implements IUserController {
    constructor(@inject(TYPES.AuthService) private authService: IAuthService) {}

    async create(req: IUserCreateRequest, res: Response, next: NextFunction): Promise<void> {
        const { firstName, lastName, email, password, tenantID, role } = req.body;
        logger.debug(`Creating custom user: ${email}`);
        try {
            const user = await this.authService.create({
                firstName,
                lastName,
                email,
                password,
                role,
                tenantID,
            });
            logger.info(`User created: ${email}`);
            res.status(201).json({ ...user, password: undefined, success: true });
        } catch (error) {
            next(error);
        }
    }
}

export default UserController;
