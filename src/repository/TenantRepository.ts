import { inject, injectable } from 'inversify';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from '../entity/User';
import { ITenant, UserData } from '../types';
import { IAuthRepository } from './Interfaces/IAuthRepoistory';
import { TYPES } from '../constants';
import { ITenantRepository } from './Interfaces/ITenantRepository';
import { Tenant } from '../entity/Tenant';

@injectable()
class TenantRepository implements ITenantRepository {
    constructor(@inject(TYPES.TenantRepo) private tenantRepo: Repository<Tenant>) {}
    async save(data: ITenant): Promise<Tenant> {
        return await this.tenantRepo.save(data);
    }
}

export default TenantRepository;
