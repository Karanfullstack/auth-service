import { Container } from 'inversify';
import AuthRepository from '../repository/AuthRepository';
import AuthService from '../services/AuthService';
import { AuthControllerI, AuthRepositoryI, AuthServiceI } from '../types';
import AuthController from '../controllers/AuthController';
import { Logger } from 'winston';
import logger from './logger';
import { TYPES } from '../constants';
import JwtService from '../utils/JWTService';

const container = new Container();

// @CONTROLLERS
container.bind<AuthControllerI>(TYPES.AuthController).to(AuthController);

// @SERVICES
container.bind<AuthServiceI>(TYPES.AuthService).to(AuthService);

// @REPOSITORIES
container.bind<AuthRepositoryI>(TYPES.AuthRepository).to(AuthRepository);

// UTILS SERVICES LIKE JWT, MAILER, ETC
container.bind(TYPES.JWTService).to(JwtService);
container.bind<Logger>(TYPES.Logger).toConstantValue(logger);

export { container };
