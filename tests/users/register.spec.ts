import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';

describe('POST /auth/register', () => {
   let connection: DataSource;
   beforeAll(async () => {
      connection = await AppDataSource.initialize();
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
   });

   describe('Fields are missing', () => {});
});
