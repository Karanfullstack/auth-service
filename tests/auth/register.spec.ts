import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { User } from '../../src/entity/User';
import { RegisterResponse } from '../../src/types';
import { isJwt } from '../utils';
import { RefreshToken } from '../../src/entity/RefreshToken';

describe('POST /auth/register', () => {
    let connection: DataSource;
    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        // await truncateTables(connection);
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe('Given all fields', () => {
        // userData for request body
        const userData = {
            firstName: 'karan',
            lastName: 'C',
            email: 'karan@gmail.com',
            password: 'secrets12',
        };
        it('should return 201 status code', async () => {
            const response = await request(app).post('/auth/register').send(userData);
            expect(response.statusCode).toBe(201);
        });
        it('should return valid JSON reponse', async () => {
            const response = await request(app).post('/auth/register').send(userData);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });
        it('should persit the user in the database', async () => {
            await request(app).post('/auth/register').send(userData);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(1);
            expect(users[0].firstName).toBe(userData.firstName);
            expect(users[0].lastName).toBe(userData.lastName);
            expect(users[0].email).toBe(userData.email);
        });

        it('should return the user id', async () => {
            const response = await request(app).post('/auth/register').send(userData);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(response.body as RegisterResponse).toHaveProperty('id');
            expect(response.body as RegisterResponse).toHaveProperty('success');
            expect((response.body as RegisterResponse).id).toBe(users[0].id);
        });

        it('should assing a customer role to the user', async () => {
            await request(app).post('/auth/register').send(userData);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0]).toHaveProperty('role');
            expect(users[0].role).toBe('customer');
        });

        it('should store the hashed password in the database', async () => {
            await request(app).post('/auth/register').send(userData);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0].password).not.toBe(userData.password);
            expect(users[0].password).toHaveLength(60);
            expect(users[0].password).toMatch(/^\$2a\$\d+\$/);
        });

        it('should return 400 status code if the email is already registered', async () => {
            await request(app).post('/auth/register').send(userData);
            const response = await request(app).post('/auth/register').send(userData);
            const users = await connection.getRepository(User).find();
            expect(users).toHaveLength(1);
            expect(response.statusCode).toBe(400);
        });

        it('should return access token and refresh token inside the cookie', async () => {
            interface Headers {
                ['set-cookie']: string[];
            }
            let accessToken: string | null = null;
            let refreshToken: string | null = null;
            const response = await request(app).post('/auth/register').send(userData);
            const cookies = (response.headers as unknown as Headers)['set-cookie'] || [];

            cookies.forEach((cookie) => {
                if (cookie.startsWith('accessToken=')) {
                    accessToken = cookie.split(';')[0].split('=')[1];
                }
                if (cookie.startsWith('refreshToken=')) {
                    refreshToken = cookie.split(';')[0].split('=')[1];
                }
            });
            expect(accessToken).not.toBeNull();
            expect(refreshToken).not.toBeNull();
            expect(isJwt(accessToken)).toBeTruthy();
            expect(isJwt(refreshToken)).toBeTruthy();
        });

        it('should persit Refresh token in the databse', async () => {
            const response = await request(app).post('/auth/register').send(userData);
            const refreshTokenRepository = connection.getRepository(RefreshToken);

            const tokens = await refreshTokenRepository
                .createQueryBuilder('refreshToken')
                .where('refreshToken.userId = :userId', {
                    userId: (response.body as Record<string, string>).id,
                })
                .getMany();
            expect(tokens).toHaveLength(1);
        });
    });

    describe('Fields are missing', () => {
        it('should return 400 status code if the email is missing', async () => {
            const userData = {
                firstName: 'karan',
                lastName: 'C',
                email: '',
                password: 'secrets12',
            };
            const response = await request(app).post('/auth/register').send(userData);
            const repository = await connection.getRepository(User).find();
            expect(repository).toHaveLength(0);
            expect(response.statusCode).toBe(400);
        });

        it('should return 400 status code if the firstName is missing', async () => {
            const userData = {
                firstName: '',
                lastName: 'C',
                email: 'karan@gmail.com',
                password: 'secrets12',
            };
            const response = await request(app).post('/auth/register').send(userData);
            const repository = await connection.getRepository(User).find();
            expect(repository).toHaveLength(0);
            expect(response.statusCode).toBe(400);
        });

        it('should return 400 status code if the lastName is missing', async () => {
            const userData = {
                firstName: 'karan@gmail.com',
                lastName: '',
                email: 'karan@gmail.com',
                password: 'secrets12',
            };
            const response = await request(app).post('/auth/register').send(userData);
            const repository = await connection.getRepository(User).find();
            expect(repository).toHaveLength(0);
            expect(response.statusCode).toBe(400);
        });

        it('should return 400 status code if the password is missing', async () => {
            const userData = {
                firstName: 'karan',
                lastName: 'C',
                email: 'karan@gmail.com',
                password: '',
            };
            const response = await request(app).post('/auth/register').send(userData);
            const repository = await connection.getRepository(User).find();
            expect(repository).toHaveLength(0);
            expect(response.statusCode).toBe(400);
        });
    });

    describe('Fields sanatization', () => {
        it('should trim the email field', async () => {
            const userData = {
                firstName: 'karan',
                lastName: 'C',
                email: ' karan@gmail.com ',
                password: 'secrets12',
            };
            await request(app).post('/auth/register').send(userData);
            const repository = await connection.getRepository(User).find();
            expect(repository[0].email).toBe('karan@gmail.com');
        });
        it('should return 400 status code if the email is not a valid email', async () => {
            const userData = {
                firstName: 'karan',
                lastName: 'C',
                email: 'karangmailcom',
                password: 'secrets12',
            };
            const response = await request(app).post('/auth/register').send(userData);
            const repository = await connection.getRepository(User).find();
            const message = response.body.errors.map((err: any) => err.msg);
            expect(repository).toHaveLength(0);
            expect(response.statusCode).toBe(400);
            expect(message).toContain('It should be a valid email');
        });

        it('should return 400 status code if the password length less than 8 char', async () => {
            const userData = {
                firstName: 'karan',
                lastName: 'C',
                email: 'karangmailcom',
                password: 'secr',
            };
            const response = await request(app).post('/auth/register').send(userData);
            const repository = await connection.getRepository(User).find();
            expect(repository).toHaveLength(0);
            expect(response.statusCode).toBe(400);
        });

        it('should return array of error message if email is missing', async () => {
            const userData = {
                firstName: 'karan',
                lastName: 'C',
                email: '',
                password: 'secrere11',
            };
            const response = await request(app).post('/auth/register').send(userData);
            const repository = await connection.getRepository(User).find();
            const messages = response.body.errors.map((err: any) => err.msg);
            expect(repository).toHaveLength(0);
            expect(response.body).toHaveProperty('errors');
            expect(Array.isArray(response.body.errors)).toBe(true);
            expect(messages).toContain('Email is required');
        });
    });
});
