import { inject, injectable } from 'inversify';
import { FindOneOptions, Repository } from 'typeorm';
import { TYPES } from '../constants';
import { Tenant } from '../entity/Tenant';
import { ITenant } from '../types';
import { ITenantRepository } from './Interfaces/ITenantRepository';

@injectable()
class TenantRepository implements ITenantRepository {
    constructor(@inject(TYPES.TenantRepo) private tenantRepo: Repository<Tenant>) {}
    async save(data: ITenant): Promise<Tenant> {
        return await this.tenantRepo.save(data);
    }

    async deleteTenant(id: number): Promise<void> {
        const deleted = this.tenantRepo.delete(id);
    }

    async findOne(payload: FindOneOptions<Tenant>): Promise<Tenant | null> {
        return this.tenantRepo.findOne(payload);
    }
    async tenantQueryBuilder(): Promise<Repository<Tenant>> {
        return this.tenantRepo;
    }
}

export default TenantRepository;
