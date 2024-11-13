import { Tenant } from '../../entity/Tenant';
import { ITenant } from '../../types';

export interface ITenantService {
    create(data: ITenant): Promise<Tenant>;
}
