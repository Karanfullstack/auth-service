import { inject, injectable } from 'inversify';
import { IUpdateUser, IUserQuery, UserData } from '../types';
import { IAuthService } from './Interfaces/IAuthService';
import { IAuthRepository } from '../repository/Interfaces/IAuthRepoistory';
import { User } from '../entity/User';
import { TYPES } from '../constants';
import createHttpError from 'http-errors';
import CredentialService from './CredentialService';

@injectable()
class AuthService implements IAuthService {
    private authRepository: IAuthRepository;
    private credentialService: CredentialService;
    constructor(
        @inject(TYPES.AuthRepository) authRepository: IAuthRepository,
        @inject(TYPES.CredentialService) credentialService: CredentialService,
    ) {
        this.authRepository = authRepository;
        this.credentialService = credentialService;
    }
    // Register a new user
    async create({
        firstName,
        lastName,
        password,
        email,
        role,
        tenantID,
    }: UserData): Promise<User> {
        const user = await this.authRepository.findByEmail(email);
        if (user) {
            const err = createHttpError(400, 'User already exists');
            throw err;
        }

        const hashed = await this.credentialService.generateHash(password);

        const newUser = await this.authRepository.save({
            firstName,
            lastName,
            password: hashed,
            email,
            role,
            tenant: tenantID ? { id: tenantID } : null,
        });

        const data = await this.authRepository.findOne({
            where: { id: newUser.id },
            relations: { tenant: true },
        });
        if (!data) {
            const err = createHttpError(400, 'Error  while creating a new user');
            throw err;
        }
        return data;
    }

    async login({ email, password }: UserData): Promise<User> {
        const user = await this.authRepository.findOne({
            where: { email },
            relations: { tenant: true },
        });

        if (!user) {
            const err = createHttpError(401, 'Unauthorized');
            throw err;
        }
        const isMatch = await this.credentialService.compareHash(password, user.password);

        if (!isMatch) {
            const err = createHttpError(401, 'Invalid credentials');
            throw err;
        }

        return user;
    }

    async self(id: number): Promise<User> {
        const user = await this.getUserById(id);
        if (!user) {
            const err = createHttpError(404, 'User not found');
            throw err;
        }
        return user;
    }

    async getUserById(id: number): Promise<User | null> {
        return this.authRepository.findOne({ where: { id }, relations: { tenant: true } });
    }

    async deleteUser(id: number): Promise<User | null> {
        return await this.authRepository.deleteByID(id);
    }

    async getAllUsers(query: IUserQuery): Promise<[User[], number]> {
        const queryBuilder = this.authRepository.queryBuilder('user');

        if (query.q || query.role) {
            const searchTerm = `%${query.q}%`;
            if (query.q) {
                queryBuilder.where((qb) => {
                    qb.where(`CONCAT(user.firstName, ' ', user.lastName) ILike :q`, {
                        q: searchTerm,
                    });
                });
            }
            if (query.role) {
                queryBuilder.andWhere(`user.role = :role`, {
                    role: query.role,
                });
            }
        }
        const result = await queryBuilder
            .leftJoinAndSelect('user.tenant', 'tenant')
            .skip((query.currentPage - 1) * query.perPage)
            .take(query.perPage)
            .orderBy('user.id', 'DESC')
            .getManyAndCount();

        return result;
    }

    async updateUser(payload: IUpdateUser, id: number): Promise<User | null> {
        await this.authRepository.update(id, {
            firstName: payload.firstName,
            lastName: payload.lastName,
            role: payload.role,
            tenant: payload.tenantID ? { id: payload.tenantID } : null,
        });
        const updatedUser = await this.authRepository.findByID(id);
        return updatedUser;
    }
}

export default AuthService;
