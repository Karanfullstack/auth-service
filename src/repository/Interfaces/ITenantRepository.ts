import { FindOneOptions, Repository } from 'typeorm';
import { Tenant } from '../../entity/Tenant';
import { ITenant } from '../../types';

export interface ITenantRepository {
    save(data: ITenant): Promise<Tenant>;
    tenantQueryBuilder(): Promise<Repository<Tenant>>;
    deleteTenant(id: number): Promise<void>;
    findOne(payload: FindOneOptions<Tenant>): Promise<Tenant | null>;
}

export interface ITenantDelete {
    id: number;
    name: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}
