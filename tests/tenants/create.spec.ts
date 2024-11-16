import createJWKS from 'mock-jwks';
import request from 'supertest';
import { DataSource } from 'typeorm';
import app from '../../src/app';
import { AppDataSource } from '../../src/config/data-source';
import { Tenant } from '../../src/entity/Tenant';
import { Roles } from '../../src/constants';

describe('POST /tenants', () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKS>;
    let adminToken: string;
    beforeAll(async () => {
        jwks = createJWKS('http://localhost:5501');
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks.start();
        await connection.dropDatabase();
        await connection.synchronize();
        adminToken = jwks.token({
            sub: '1',
            role: Roles.ADMIN,
        });
    });

    afterEach(() => {
        jwks.stop();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe('Given fields', () => {
        const tenantData = {
            name: 'loream ipsum dolor sit amet, consectetur adipiscing elit',
            address: 'temp address',
        };

        it('should return 201 status code.', async () => {
            const response = await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData);
            expect(response.statusCode).toBe(201);
        });

        it('should create a tenant.', async () => {
            const tenantRepo = AppDataSource.getRepository(Tenant);
            const response = await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData);

            const tenant = await tenantRepo.find();
            expect(tenant).toHaveLength(1);
            expect(tenant[0].name).toBe(tenantData.name);
            expect(tenant[0].address).toBe(tenantData.address);
            expect(response.body).toHaveProperty('id');
            expect(typeof response.body.id).toBe('number');
            expect(response.body.id).toBe(tenant[0].id);
        });

        it('should return all tenants', async () => {
            const tenantData = {
                name: 'loream ipsum dolor sit amet, consectetur adipiscing elit',
                address: 'temp address',
            };
            await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData);

            const allTenants = await request(app).get('/tenants').send();

            const tenantRepo = await AppDataSource.getRepository(Tenant).find();

            expect(tenantRepo).toHaveLength(1);
            expect(tenantRepo[0].address).toContain('temp address');
            expect(allTenants.body).toHaveProperty('currentPage');
            expect(allTenants.body).toHaveProperty('perPage');
            expect(allTenants.body).toHaveProperty('data');
        });

        it('should delete a tenant from database', async () => {
            // create a tenant
            await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData);

            await request(app).get('/tenants').send();

            const deleteResponse = await request(app)
                .delete('/tenants/1')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send();

            const tenantRepo = await AppDataSource.getRepository(Tenant).find();
            expect(tenantRepo).toHaveLength(0);
            expect(deleteResponse.statusCode).toBe(200);
        });

        it('should update a single tenant', async () => {
            const updateData = {
                address: 'some street are find',
                name: 'new burger restaurant',
            };
            await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData);

            const getResponse = await request(app)
                .patch('/tenants/1')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(updateData);

            const tenantRepo = AppDataSource.getRepository(Tenant);
            const tenant = await tenantRepo.findOne({ where: { id: 1 } });
            expect(tenant?.name).toBe(updateData.name);
            expect(tenant?.address).toBe(updateData.address);
        });

        it('should return single tenant', async () => {
            await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData);
            const tenant = await request(app).get('/tenants/1').send();
            expect(tenant.statusCode).toBe(200);
            expect(tenant.body).toHaveProperty('name');
            expect(tenant.body).toHaveProperty('address');
            expect(tenant.body).toHaveProperty('id');
        });
    });

    describe('Fields are missing', () => {
        it('should return 400 status code if request data is not propper.', async () => {
            const tenantData = {
                name: 'elit',
                address: 'add',
            };
            const tenantRepo = AppDataSource.getRepository(Tenant);
            const response = await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData);

            const tenant = await tenantRepo.find();

            expect(tenant).toHaveLength(0);
            expect(response.statusCode).toBe(400);
        });

        it('should return error message if name validation fails.', async () => {
            const tenantData = {
                name: 'elit',
                address: 'addwfwwfffe',
            };
            const tenantRepo = AppDataSource.getRepository(Tenant);

            const response = await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData);
            const tenant = await tenantRepo.find();
            const message = response.body.errors.map((error: { msg: string }) => error.msg);

            expect(tenant).toHaveLength(0);
            expect(response.statusCode).toBe(400);
            expect(Array.isArray(response.body.errors)).toBeTruthy();
            expect(message).toContain('Length must be between 5 and 100');
        });

        it('should return error message if address validation fails.', async () => {
            const tenantData = {
                name: 'elit elite elite ',
                address: 'add',
            };
            const tenantRepo = AppDataSource.getRepository(Tenant);

            const response = await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData);
            const tenant = await tenantRepo.find();
            const message = response.body.errors.map((error: { msg: string }) => error.msg);

            expect(tenant).toHaveLength(0);
            expect(response.statusCode).toBe(400);
            expect(Array.isArray(response.body.errors)).toBeTruthy();
            expect(message).toContain('Lenght must be between 5 and 255');
        });

        it('should return 401 status code if user is not authenticated.', async () => {
            const tenantData = {
                name: 'elitefe',
                address: 'addefef',
            };
            const tenantRepo = AppDataSource.getRepository(Tenant);
            const response = await request(app).post('/tenants').send(tenantData);

            const tenant = await tenantRepo.find();
            expect(tenant).toHaveLength(0);
            expect(response.statusCode).toBe(401);
        });

        it('should return 403 status code if user is not admin.', async () => {
            const managerToken = jwks.token({ sub: '1', role: Roles.MANAGER });
            const tenantData = {
                name: 'elitefe',
                address: 'addefef',
            };
            const tenantRepo = AppDataSource.getRepository(Tenant);
            const response = await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${managerToken}`])
                .send(tenantData);

            const errorMessage = response.body.errors.map((err: { msg: string }) => err.msg);
            const tenant = await tenantRepo.find();
            expect(tenant).toHaveLength(0);
            expect(response.statusCode).toBe(403);
            expect(Array.isArray(response.body.errors)).toBeTruthy();
            expect(errorMessage).toContain('You do not have permission to access this resource');
        });

        it('should return 404 status code if tenant id does not exist to be deleted', async () => {
            const tenantData = {
                name: 'loream ipsum dolor sit amet, consectetur adipiscing elit',
                address: 'temp address',
            };
            // create a tenant
            await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData);

            await request(app).get('/tenants').send();

            const deleteResponse = await request(app)
                .delete('/tenants/2')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send();
            const errMessage = deleteResponse.body.errors.map((err: { msg: string }) => err.msg);
            const tenantRepo = await AppDataSource.getRepository(Tenant).find();
            expect(tenantRepo).toHaveLength(1);
            expect(deleteResponse.statusCode).toBe(404);
            expect(Array.isArray(deleteResponse.body.errors)).toBeTruthy();
            expect(deleteResponse.body).toHaveProperty('errors');
            expect(errMessage).toContain('Tenant not found to be deleted');
        });
    });
});
