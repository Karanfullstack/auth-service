import { inject, injectable } from 'inversify';
import { ITenantService } from './Interfaces/ITenantService';
import { ITenantRepository } from '../repository/Interfaces/ITenantRepository';
import { TYPES } from '../constants';
import { Tenant } from '../entity/Tenant';
import { ITeanantQuery, ITenant } from '../types';
import createHttpError from 'http-errors';

@injectable()
class TenantService implements ITenantService {
    constructor(@inject(TYPES.TenantRepository) private tenantRepo: ITenantRepository) {}
    async create(data: ITenant): Promise<Tenant> {
        const tenant = await this.tenantRepo.save(data);
        return tenant;
    }

    async getAll(query: ITeanantQuery): Promise<[Tenant[], number]> {
        const queryBuilder = this.tenantRepo.tenantQueryBuilder().createQueryBuilder('tenant');

        if (query.q) {
            const searchTerm = `%${query.q}%`;
            queryBuilder.where('CONCAT(tenant.name , tenant.address) ILike :q', {
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

    async deleteOne(id: number): Promise<Tenant> {
        const findTenant = await this.tenantRepo.findOne({ where: { id: id } });
        if (!findTenant) {
            const error = createHttpError(404, 'Tenant not found to be deleted');
            throw error;
        }
        return await this.tenantRepo.deleteTenant(id);
    }

    async updateOne(id: number, data: ITenant): Promise<Tenant> {
        const findTeant = await this.tenantRepo.findOne({ where: { id: id } });
        if (!findTeant) {
            const error = createHttpError(404, 'Tenant not found to be updated');
            throw error;
        }

        await this.tenantRepo.updateOne(id, data);
        return findTeant;
    }
    async getOne(id: number): Promise<Tenant> {
        const tenant = await this.tenantRepo.findOne({ where: { id: id } });
        if (!tenant) {
            const error = createHttpError(404, 'Tenant not found');
            throw error;
        }
        return tenant;
    }
}

export default TenantService;
