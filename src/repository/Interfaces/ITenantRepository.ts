import { Tenant } from '../../entity/Tenant';
import { ITenant } from '../../types';

export interface ITenantRepository {
    save(data: ITenant): Promise<Tenant>;
}
