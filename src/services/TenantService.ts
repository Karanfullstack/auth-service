import { inject, injectable } from 'inversify';
import { ITenantService } from './Interfaces/ITenantService';

import { ITenantRepository } from '../repository/Interfaces/ITenantRepository';
import { TYPES } from '../constants';
import { Tenant } from '../entity/Tenant';
import { ITenant } from '../types';

@injectable()
class TenantService implements ITenantService {
    constructor(@inject(TYPES.TenantRepository) private tenantRepo: ITenantRepository) {}
    async create(data: ITenant): Promise<Tenant> {
        const tenant = await this.tenantRepo.save(data);
        return tenant;
    }
}

export default TenantService;
