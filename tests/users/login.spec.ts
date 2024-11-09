import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { isJwt } from '../utils';

describe('POST/auth/login', () => {
   let connection: DataSource;
   beforeAll(async () => {
      connection = await AppDataSource.initialize();
   });

   beforeEach(async () => {
      await connection.dropDatabase();
      await connection.synchronize();
   });

   afterAll(async () => {
      await connection.destroy();
   });

   describe('Given all fields', () => {
      it('should return 200 and a user id', async () => {
         // Arrange
         const registerData = {
            firstName: 'Karan',
            lastName: 'Joshi',
            email: 'karan@gmail.com',
            password: 'karanjiiiiii',
         };
         const loginData = {
            email: 'karan@gmail.com',
            password: 'karanjiiiiii',
         };
         // Act
         await request(app).post('/auth/register').send(registerData);
         const loginResponse = await request(app).post('/auth/login').send(loginData);
         // Assert
         expect(loginResponse.statusCode).toBe(200);
         expect(loginResponse.body).toHaveProperty('id');
      });

      it('shoud return valid json response', async () => {
         // Arrange
         const registerData = {
            firstName: 'Karan',
            lastName: 'Joshi',
            email: 'karan@gmail.com',
            password: 'karanjiiiiii',
         };
         const loginData = {
            email: 'karan@gmail.com',
            password: 'karanjiiiiii',
         };
         // Act
         await request(app).post('/auth/register').send(registerData);
         const loginResponse = await request(app).post('/auth/login').send(loginData);
         // Assert
         expect(loginResponse.headers['content-type']).toEqual(expect.stringContaining('json'));
      });

      it('should have valid refresh token and access token in cookie', async () => {
         // Arrange
         interface Headers {
            ['set-cookie']: string[];
         }
         const registerData = {
            firstName: 'Karan',
            lastName: 'Joshi',
            email: 'karan@gmail.com',
            password: 'karanjiiiiii',
         };
         const loginData = {
            email: 'karan@gmail.com',
            password: 'karanjiiiiii',
         };
         // Act
         await request(app).post('/auth/register').send(registerData);
         const loginResponse = await request(app).post('/auth/login').send(loginData);

         let refreshToken: string | null = null;
         let acccessToken: string | null = null;

         const cookies = (loginResponse.headers as unknown as Headers)['set-cookie'] || [];
         cookies.forEach((cookie) => {
            if (cookie.startsWith('accessToken=')) {
               acccessToken = cookie.split(';')[0].split('=')[1];
            }
            if (cookie.startsWith('refreshToken=')) {
               refreshToken = cookie.split(';')[0].split('=')[1];
            }
         });
         // Assert
         expect(acccessToken).not.toBeNull();
         expect(refreshToken).not.toBeNull();
         expect(isJwt(acccessToken)).toBeTruthy();
         expect(isJwt(refreshToken)).toBeTruthy();
      });
   });

   describe('Incorrect Credentials', () => {
      it('should return 401 status code if email does not exists in db', async () => {
         // Arrange
         const registerData = {
            firstName: 'Karan',
            lastName: 'Joshi',
            email: 'karan@gmail.com',
            password: 'karanjiiiiii',
         };
         const loginData = {
            email: 'ka1ran@gmail.com',
            password: 'karanjiiiiii',
         };
         // Act
         await request(app).post('/auth/register').send(registerData);
         const loginResponse = await request(app).post('/auth/login').send(loginData);

         // Assert
         expect(loginResponse.statusCode).toBe(401);
      });

      it('should return 401 status code if password does not match ', async () => {
         // Arrange
         const registerData = {
            firstName: 'Karan',
            lastName: 'Joshi',
            email: 'karan@gmail.com',
            password: 'karanjiiiiii',
         };
         const loginData = {
            email: 'karan@gmail.com',
            password: 'karanjiiiiiii',
         };
         // Act
         await request(app).post('/auth/register').send(registerData);
         const loginResponse = await request(app).post('/auth/login').send(loginData);

         // Assert
         expect(loginResponse.statusCode).toBe(401);
      });
   });
   describe('Sanatization fiedls', () => {
      it('should trim the email  if it has spaces in it.', async () => {
         // Arrange
         const registerData = {
            firstName: 'Karan',
            lastName: 'Joshi',
            email: 'karan@gmail.com',
            password: 'karanjiiiiii',
         };
         const loginData = {
            email: ' karan@gmail.com ',
            password: 'karanjiiiiii',
         };
         // Act
         await request(app).post('/auth/register').send(registerData);
         const loginResponse = await request(app).post('/auth/login').send(loginData);

         // Assert
         expect(loginResponse.body.email).toBe(registerData.email);
      });

      it('should return 400 status code if email is invalid.', async () => {
         // Arrange
         const registerData = {
            firstName: 'Karan',
            lastName: 'Joshi',
            email: 'karan@gmail.com',
            password: 'karanjiiiiii',
         };
         const loginData = {
            email: 'karangmail.com',
            password: 'karanjiiiiii',
         };
         // Act
         const loginResponse = await request(app).post('/auth/login').send(loginData);

         // Assert
         expect(loginResponse.statusCode).toBe(400);
      });
   });
});
