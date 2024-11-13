import createJWKS from 'mock-jwks';
import request from 'supertest';
import { DataSource } from 'typeorm';
import app from '../../src/app';
import { AppDataSource } from '../../src/config/data-source';
import { Tenant } from '../../src/entity/Tenant';

describe('POST /tenants', () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKS>;
    beforeAll(async () => {
        jwks = createJWKS('http://localhost:5501');
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks.start();
        await connection.dropDatabase();
        await connection.synchronize();
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
            const response = await request(app).post('/tenants').send(tenantData);
            expect(response.statusCode).toBe(201);
        });
        it('should create a tenant.', async () => {
            const tenantRepo = AppDataSource.getRepository(Tenant);
            const response = await request(app).post('/tenants').send(tenantData);
            const tenant = await tenantRepo.find();
            expect(tenant).toHaveLength(1);
            expect(tenant[0].name).toBe(tenantData.name);
            expect(tenant[0].address).toBe(tenantData.address);
            expect(response.body).toHaveProperty('id');
            expect(typeof response.body.id).toBe('number');
            expect(response.body.id).toBe(tenant[0].id);
        });
    });

    describe('Fields are missing', () => {
        const tenantData = {
            name: 'elit',
            address: 'add',
        };

        it('should return 400 status code if request data is not propper.', async () => {
            const tenantRepo = AppDataSource.getRepository(Tenant);
            const response = await request(app).post('/tenants').send(tenantData);

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
            const response = await request(app).post('/tenants').send(tenantData);
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
            const response = await request(app).post('/tenants').send(tenantData);
            const tenant = await tenantRepo.find();
            const message = response.body.errors.map((error: { msg: string }) => error.msg);
            expect(tenant).toHaveLength(0);
            expect(response.statusCode).toBe(400);
            expect(Array.isArray(response.body.errors)).toBeTruthy();
            expect(message).toContain('Lenght must be between 5 and 255');
        });
    });
});
