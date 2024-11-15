import { Tenant } from '../../entity/Tenant';
import { ITeanantQuery, ITenant } from '../../types';

export interface ITenantService {
    create(data: ITenant): Promise<Tenant>;
    getAll(query: ITeanantQuery): Promise<[Tenant[], number]>;
    deleteOne(id: number): Promise<void>;
}
