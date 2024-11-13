import { Repository } from 'typeorm';
import { User } from '../entity/User';
import { AppDataSource } from '../config/data-source';
import { RefreshToken } from '../entity/RefreshToken';
import { Tenant } from '../entity/Tenant';

export function UserRepository(): Repository<User> {
    return AppDataSource.getRepository(User);
}

export function RefreshTokenRepository(): Repository<RefreshToken> {
    return AppDataSource.getRepository(RefreshToken);
}

export function TenantRepo(): Repository<Tenant> {
    return AppDataSource.getRepository(Tenant);
}
