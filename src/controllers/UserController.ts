import { inject, injectable } from 'inversify';
import { IUserController } from './Interfaces/IUserController';
import { TYPES } from '../constants';
import { IAuthService } from '../services/Interfaces/IAuthService';
import { IUpdateUserRequest, IUserCreateRequest, IUserQuery } from '../types';
import { NextFunction, Request, Response } from 'express';
import logger from '../config/logger';
import createHttpError from 'http-errors';
import { matchedData, validationResult } from 'express-validator';

@injectable()
class UserController implements IUserController {
    constructor(@inject(TYPES.AuthService) private authService: IAuthService) {}

    async create(req: IUserCreateRequest, res: Response, next: NextFunction): Promise<void> {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() });
            return;
        }

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

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = Number(req.params.id);
        if (isNaN(Number(id))) {
            const err = createHttpError(400, 'Invalid Params');
            next(err);
            return;
        }
        try {
            await this.authService.deleteUser(id);
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    }
    async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = Number(req.params.id);
        if (isNaN(Number(id))) {
            const err = createHttpError(400, 'Inalid Params');
            next(err);
            return;
        }
        try {
            const user = await this.authService.getUserById(id);
            if (!user) {
                const err = createHttpError('404', 'User not found');
                next(err);
                return;
            }
            res.json({ ...user, password: undefined });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        const validate: IUserQuery = matchedData(req, { onlyValidData: true });
        const [users, count] = await this.authService.getAllUsers(validate);
        res.json({
            success: true,
            currentPage: validate.currentPage,
            perPage: validate.perPage,
            total: count,
            data: users,
        });
    }
    async update(req: IUpdateUserRequest, res: Response, next: NextFunction): Promise<void> {
        const id = Number(req.params.id);

        if (isNaN(Number(id))) {
            const err = createHttpError(400, 'Param id is not valid');
            next(err);
            return;
        }
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() });
            return;
        }

        const { firstName, lastName, role, tenantID } = req.body;
        logger.debug('user is requesting', { ...req.body });
        try {
            const updatedUser = await this.authService.updateUser(
                {
                    firstName,
                    lastName,
                    role,
                    tenantID,
                },
                id,
            );
            logger.info('User has been updated', { user: updatedUser });
            res.json({ ...updatedUser, passsword: undefined, success: true });
        } catch (error) {
            next(error);
        }
    }
}

export default UserController;
