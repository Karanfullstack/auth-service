import { Container } from 'inversify';
import AuthRepository from '../repository/AuthRepository';
import AuthService from '../services/AuthService';
import { IAuthController } from '../controllers/Interfaces/IAuthController';
import { IAuthService } from '../services/Interfaces/IAuthService';
import { IAuthRepository } from '../repository/Interfaces/IAuthRepoistory';
import AuthController from '../controllers/AuthController';
import { TYPES } from '../constants';
import TokenService from '../services/TokenService';
import { Repository } from 'typeorm';
import {
    RefreshTokenRepository,
    TenantRepo,
    UserRepository,
} from '../repository/FactoryRepository';
import { User } from '../entity/User';
import { RefreshToken } from '../entity/RefreshToken';
import CredentialService from '../services/CredentialService';
import { Tenant } from '../entity/Tenant';
import { ITenantRepository } from '../repository/Interfaces/ITenantRepository';
import TenantRepository from '../repository/TenantRepository';
import { ITenantController } from '../controllers/Interfaces/ITenantConroller';
import TenantController from '../controllers/TenantController';
import { ITenantService } from '../services/Interfaces/ITenantService';
import TenantService from '../services/TenantService';
import { IUserController } from '../controllers/Interfaces/IUserController';
import UserController from '../controllers/UserController';

const container = new Container();

// @CONTROLLERS
container.bind<IAuthController>(TYPES.AuthController).to(AuthController);
container.bind<ITenantController>(TYPES.TenantController).to(TenantController);
container.bind<IUserController>(TYPES.UserController).to(UserController);
// @SERVICES
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<ITenantService>(TYPES.TenantService).to(TenantService);

// @REPOSITORIES
container.bind<IAuthRepository>(TYPES.AuthRepository).to(AuthRepository);
container.bind<ITenantRepository>(TYPES.TenantRepository).to(TenantRepository);

// UTILS SERVICES LIKE JWT, MAILER, ETC
container
    .bind<Repository<User>>(TYPES.UserRepository)
    .toDynamicValue(UserRepository)
    .inRequestScope();

container
    .bind<Repository<RefreshToken>>(TYPES.RefreshTokenRepository)
    .toDynamicValue(RefreshTokenRepository)
    .inRequestScope();

container.bind<Repository<Tenant>>(TYPES.TenantRepo).toDynamicValue(TenantRepo).inRequestScope();
container.bind<TokenService>(TYPES.TokenService).to(TokenService);
container.bind<CredentialService>(TYPES.CredentialService).to(CredentialService);

export { container };
