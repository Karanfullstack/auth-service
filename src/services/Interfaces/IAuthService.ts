import { User } from '../../entity/User';
import { UserData } from '../../types';

export interface IAuthService {
   create(data: UserData): Promise<User>;
}
