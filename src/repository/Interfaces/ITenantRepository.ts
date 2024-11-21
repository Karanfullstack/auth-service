import { FindOneOptions, Repository } from 'typeorm';
import { Tenant } from '../../entity/Tenant';
import { ITenant } from '../../types';

export interface ITenantRepository {
    save(data: ITenant): Promise<Tenant>;
    tenantQueryBuilder(): Repository<Tenant>;
    deleteTenant(id: number): Promise<Tenant>;
    findOne(payload: FindOneOptions<Tenant>): Promise<Tenant | null>;
    updateOne(id: number, data: ITenant): Promise<Tenant>;
}

export interface ITenantDelete {
    id: number;
    name: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}
