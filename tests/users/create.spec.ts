import createJWKS from 'mock-jwks';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { Roles } from '../../src/constants';
import request from 'supertest';
import app from '../../src/app';

describe('POST /users', () => {
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
        const userData = {
            firstName: 'Karan',
            lastName: 'Chauhan',
            email: 'karan@122.com',
            password: 'passwordeee',
            role: Roles.MANAGER,
            tenantID: 1,
        };

        it('should create a new user by admin', async () => {
            await request(app)
                .post('/tenants')
                .set('Cookie', `accessToken=${adminToken}`)
                .send({ name: 'Tenant 1', address: 'Address 1' });

            const response = await request(app)
                .post('/users')
                .set('Cookie', `accessToken=${adminToken}`)
                .send(userData);
            expect(response.body.firstName).toBe(userData.firstName);
            expect(response.body.lastName).toBe(userData.lastName);
            expect(response.body.email).toBe(userData.email);
            expect(response.body.role).toBe(userData.role);
            expect(response.body.tenant.address).toBeDefined();
            expect(response.body.tenant.name).toBeDefined();
            expect(response.status).toBe(201);
        });

        it('should delete a user by admin', async () => {
            await request(app)
                .post('/tenants')
                .set('Cookie', `accessToken=${adminToken}`)
                .send({ name: 'Tenant 1', address: 'Address 1' });

            await request(app)
                .post('/users')
                .set('Cookie', `accessToken=${adminToken}`)
                .send(userData);

            const response = await request(app)
                .delete('/users/1')
                .set('Cookie', `accessToken=${adminToken}`)
                .send();
            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBeTruthy();
        });

        it('should get a user by admin', async () => {
            await request(app)
                .post('/tenants')
                .set('Cookie', `accessToken=${adminToken}`)
                .send({ name: 'Tenant 1', address: 'Address 1' });

            await request(app)
                .post('/users')
                .set('Cookie', `accessToken=${adminToken}`)
                .send(userData);

            const response = await request(app)
                .get('/users/1')
                .set('Cookie', `accessToken=${adminToken}`)
                .send();

            expect(response.statusCode).toBe(200);
            expect(response.body.firstName).toBe(userData.firstName);
        });

        it('should get all users by admin', async () => {
            await request(app)
                .post('/tenants')
                .set('Cookie', `accessToken=${adminToken}`)
                .send({ name: 'Tenant 1', address: 'Address 1' });

            await request(app)
                .post('/users')
                .set('Cookie', `accessToken=${adminToken}`)
                .send(userData);

            const response = await request(app)
                .get('/users')
                .set('Cookie', `accessToken=${adminToken}`)
                .send();

            expect(response.statusCode).toBe(200);
            expect(response.body.data).toHaveLength(1);
        });

        it('should update user by admin', async () => {
            const updateData = {
                firstName: 'Arjun',
                lastName: 'Chauhan',
                email: 'arjun@gmail.com',
                tenantID: 1,
                role: 'customer',
            };
            await request(app)
                .post('/tenants')
                .set('Cookie', `accessToken=${adminToken}`)
                .send({ name: 'Tenant 1', address: 'Address 1' });

            await request(app)
                .post('/users')
                .set('Cookie', `accessToken=${adminToken}`)
                .send(userData);

            const response = await request(app)
                .patch('/users/1')
                .set('Cookie', `accessToken=${adminToken}`)
                .send(updateData);

            expect(response.statusCode).toBe(200);
            expect(response.body.firstName).toBe(updateData.firstName);
            expect(response.body.lastName).toBe(updateData.lastName);
            expect(response.body.role).toBe(updateData.role);
        });
    });
});
