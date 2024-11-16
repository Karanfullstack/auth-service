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

    async deleteTenant(id: number): Promise<Tenant> {
        const tenant = await this.tenantRepo.findOne({ where: { id: id } });
        if (!tenant) {
            throw new Error('Tenant id is not valid to be deleted');
        }
        await this.tenantRepo.delete(id);
        return tenant;
    }

    async findOne(payload: FindOneOptions<Tenant>): Promise<Tenant | null> {
        return await this.tenantRepo.findOne(payload);
    }
    async tenantQueryBuilder(): Promise<Repository<Tenant>> {
        return this.tenantRepo;
    }
    async updateOne(id: number, data: ITenant): Promise<Tenant> {
        await this.tenantRepo.update(id, data);
        const tenant = await this.tenantRepo.findOne({ where: { id: id } });
        if (!tenant) {
            throw new Error('Tenant id is not valid for update');
        }
        return tenant;
    }
}

export default TenantRepository;
