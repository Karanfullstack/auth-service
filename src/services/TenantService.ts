import { inject, injectable } from 'inversify';
import { ITenantService } from './Interfaces/ITenantService';
import { ITenantRepository } from '../repository/Interfaces/ITenantRepository';
import { TYPES } from '../constants';
import { Tenant } from '../entity/Tenant';
import { ITeanantQuery, ITenant } from '../types';

@injectable()
class TenantService implements ITenantService {
    constructor(@inject(TYPES.TenantRepository) private tenantRepo: ITenantRepository) {}
    async create(data: ITenant): Promise<Tenant> {
        const tenant = await this.tenantRepo.save(data);
        return tenant;
    }
    async getAll(query: ITeanantQuery): Promise<[Tenant[], number]> {
        const queryBuilder = (await this.tenantRepo.tenantQueryBuilder()).createQueryBuilder(
            'tenant',
        );
        if (query.q) {
            const searchTerm = `%${query.q}%`;
            queryBuilder.where('CONCAT(tenant.name, " ", tenant.address) ILIKE:q', {
                q: searchTerm,
            });
        }
        const [finalResult, count] = await queryBuilder
            .skip((query.currentPage - 1) * query.perPage)
            .take(query.perPage)
            .orderBy('tenant.id', 'DESC')
            .getManyAndCount();
        return [finalResult, count];
    }
}

export default TenantService;
