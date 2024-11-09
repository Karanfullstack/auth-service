import createJWKS from 'mock-jwks';
import request from 'supertest';
import { DataSource } from 'typeorm';
import app from '../../src/app';
import { AppDataSource } from '../../src/config/data-source';

import { isJwt } from '../utils';

describe('POST /auth/refresh', () => {
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
      it('should set valid refresh token and access refresh token in cookie', async () => {
         interface Headers {
            ['set-cookie']: string[];
         }
         const userData = {
            firstName: 'karan',
            lastName: 'C',
            email: 'karan@gmail.com',
            password: 'secrets12',
         };

         // Register new user
         await request(app).post('/auth/register').send(userData);
         // Login user
         const loginResponse = await request(app)
            .post('/auth/login')
            .send({ email: 'karan@gmail.com', password: 'secrets12' });

         // Get cookies
         const cookies = (loginResponse.headers as unknown as Headers)['set-cookie'] || [];

         // Get refreshToken from cookie
         let refreshToken: null | string = null;
         cookies.forEach((cookie) => {
            if (cookie.startsWith('refreshToken=')) {
               refreshToken = cookie.split(';')[0].split('=')[1];
            }
         });

         // Parse refreshToken into refresh token endpoint.
         const refreshTokenResponse = await request(app)
            .post('/auth/refresh')
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .send();
         const newCookie = (refreshTokenResponse.headers as unknown as Headers)['set-cookie'] || [];

         let newRefeshToken: null | string = null;
         let newAccessToken: null | string = null;

         newCookie.forEach((cookie) => {
            if (cookie.startsWith('refreshToken=')) {
               newRefeshToken = cookie.split(';')[0].split('=')[1];
            }
            if (cookie.startsWith('accessToken=')) {
               newAccessToken = cookie.split(';')[0].split('=')[1];
            }
         });

         expect(isJwt(newRefeshToken)).toBeTruthy();
         expect(isJwt(newAccessToken)).toBeTruthy();
      });
   });

   describe('Missig fields', () => {
      it('should throw "jwt malformed" error message with 401 status code  if refresh token is invalid', async () => {
         const userData = {
            firstName: 'karan',
            lastName: 'C',
            email: 'karan@gmail.com',
            password: 'secrets12',
         };

         // Register new user
         await request(app).post('/auth/register').send(userData);
         // Login user
         await request(app)
            .post('/auth/login')
            .send({ email: 'karan@gmail.com', password: 'secrets12' });

         const refreshTokenResponse = await request(app)
            .post('/auth/refresh')
            .set('Cookie', [`refreshToken=jowjewlfwjflwjflwjfl`])
            .send();

         const errorMessage = refreshTokenResponse.body.errors.map((m: any) => m.msg);
         expect(Array.isArray(refreshTokenResponse.body.errors)).toBeTruthy();
         expect(errorMessage).toContain('jwt malformed');
         expect(refreshTokenResponse.statusCode).toBe(401);
      });

      it('should throw  No authorization token was found error if token is missing', async () => {
         const userData = {
            firstName: 'karan',
            lastName: 'C',
            email: 'karan@gmail.com',
            password: 'secrets12',
         };

         // Register new user
         await request(app).post('/auth/register').send(userData);
         // Login user
         await request(app)
            .post('/auth/login')
            .send({ email: 'karan@gmail.com', password: 'secrets12' });

         const refreshTokenResponse = await request(app).post('/auth/refresh').send();

         const errorMessage = refreshTokenResponse.body.errors.map((m: any) => m.msg);
         expect(Array.isArray(refreshTokenResponse.body.errors)).toBeTruthy();
         expect(errorMessage).toContain('No authorization token was found');
         expect(refreshTokenResponse.statusCode).toBe(401);
      });
   });
});
