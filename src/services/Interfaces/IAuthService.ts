import { User } from '../../entity/User';
import { UserData } from '../../types';

export interface IAuthService {
   create(data: UserData): Promise<User>;
   login(data: Pick<UserData, 'email' | 'password'>): Promise<User>;
}
