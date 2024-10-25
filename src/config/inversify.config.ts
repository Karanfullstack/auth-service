import { Container } from 'inversify';
import AuthRepository from '../repository/AuthRepository';
import AuthService from '../services/AuthService';
import { AuthControllerI, AuthRepositoryI, AuthServiceI, TYPES } from '../types';
import AuthController from '../controllers/AuthController';

const container = new Container();

container.bind<AuthRepositoryI>(TYPES.AuthRepository).to(AuthRepository);
container.bind<AuthServiceI>(TYPES.AuthService).to(AuthService);
container.bind<AuthControllerI>(TYPES.AuthController).to(AuthController);

export { container };
