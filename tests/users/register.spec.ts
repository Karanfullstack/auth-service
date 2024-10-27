import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { User } from '../../src/entity/User';
import { RegisterResponse } from '../../src/types';

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
         const response = await request(app).get('/auth/register').send(userData);
         expect(response.statusCode).toBe(201);
      });
      it('should return valid JSON reponse', async () => {
         const response = await request(app).get('/auth/register').send(userData);
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
         expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
      });
      it('should return 400 status code if the email is already registered', async () => {
         await request(app).post('/auth/register').send(userData);
         const response = await request(app).post('/auth/register').send(userData);
         const users = await connection.getRepository(User).find();
         expect(users).toHaveLength(1);
         expect(response.statusCode).toBe(400);
      });
   });

   describe('Fields are missing', () => {
      const userData = {
         firstName: 'karan',
         lastName: 'C',
         email: '',
         password: 'secrets12',
      };
      it('should return 400 status code if the email is missing', async () => {
         const response = await request(app).post('/auth/register').send(userData);
         const repository = await connection.getRepository(User).find();
         expect(repository).toHaveLength(0);
         expect(response.statusCode).toBe(400);
      });
   });
});
