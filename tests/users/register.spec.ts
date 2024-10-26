import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { truncateTables } from '../utils/truncateTables';
import { User } from '../../src/entity/User';
import { RegisterResponse } from '../../src/types';

describe('POST /auth/register', () => {
   let connection: DataSource;
   beforeAll(async () => {
      connection = await AppDataSource.initialize();
   });

   beforeEach(async () => {
      await truncateTables(connection);
   });

   afterAll(async () => {
      await connection.destroy();
   });

   describe('Given all fields', () => {
      it('should return 201 status code', async () => {
         const userData = {
            firstName: 'karan',
            lastName: 'C',
            email: 'karan@gmail.com',
            password: 'secrets12',
         };
         const response = await request(app).get('/auth/register').send(userData);
         expect(response.statusCode).toBe(201);
      });
      it('should return valid JSON reponse', async () => {
         const userData = {
            firstName: 'karan',
            lastName: 'C',
            email: 'karan@gmail.com',
            password: 'secrets12',
         };
         const response = await request(app).get('/auth/register').send(userData);
         expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
      });
      it('should persit the user in the database', async () => {
         const userData = {
            firstName: 'karan',
            lastName: 'C',
            email: 'karan@gmail.com',
            password: 'secrets12',
         };
         await request(app).post('/auth/register').send(userData);
         const userRepository = connection.getRepository(User);
         const users = await userRepository.find();
         expect(users).toHaveLength(1);
         expect(users[0].firstName).toBe(userData.firstName);
         expect(users[0].lastName).toBe(userData.lastName);
         expect(users[0].email).toBe(userData.email);
      });

      it('should return the user id', async () => {
         const userData = {
            firstName: 'karan',
            lastName: 'C',
            email: 'karan@gmail.com',
            password: 'secrets12',
         };
         const response = await request(app).post('/auth/register').send(userData);
         expect(response.body as RegisterResponse).toHaveProperty('id');
         expect(response.body as RegisterResponse).toHaveProperty('success');
         const userRepository = connection.getRepository(User);
         const users = await userRepository.find();
         expect((response.body as RegisterResponse).id).toBe(users[0].id);
      });
   });

   describe('Fields are missing', () => {});
});
