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
import { RefreshTokenRepository, UserRepository } from '../repository/FactoryRepository';
import { User } from '../entity/User';
import { RefreshToken } from '../entity/RefreshToken';
import CredentialService from '../services/CredentialService';

const container = new Container();

// @CONTROLLERS
container.bind<IAuthController>(TYPES.AuthController).to(AuthController);

// @SERVICES
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);

// @REPOSITORIES
container
   .bind<Repository<User>>(TYPES.UserRepository)
   .toDynamicValue(UserRepository)
   .inRequestScope();

container
   .bind<Repository<RefreshToken>>(TYPES.RefreshTokenRepository)
   .toDynamicValue(RefreshTokenRepository)
   .inRequestScope();

container.bind<IAuthRepository>(TYPES.AuthRepository).to(AuthRepository);

// UTILS SERVICES LIKE JWT, MAILER, ETC
container.bind<TokenService>(TYPES.TokenService).to(TokenService);
container.bind<CredentialService>(TYPES.CredentialService).to(CredentialService);

export { container };
