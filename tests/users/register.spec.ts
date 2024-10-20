import request from 'supertest';
import app from '../../src/app';

describe('POST /auth/register', () => {
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
