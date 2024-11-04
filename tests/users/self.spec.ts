import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import request from 'supertest';
import app from '../../src/app';
import createJWKS from 'mock-jwks';
import AuthRepository from '../../src/repository/AuthRepository';
import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';

describe('GET /auth/self', () => {
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
      it('should return 200 status code', async () => {
         // Arrange
         const userData = {
            firstName: 'karan',
            lastName: 'C',
            email: 'karan@gmail.com',
            password: 'secrets12',
         };
         // Act
         const userRepository = new AuthRepository(connection.getRepository(User));
         const data = await userRepository.save({ ...userData, role: Roles.CUSTOMER });
         // Generate token

         const accessToken = jwks.token({ sub: String(data.id), role: data.role });
         const response = await request(app)
            .get('/auth/self')
            .set('Cookie', [`accessToken=${accessToken}`])
            .send();

         // Assert
         expect(response.statusCode).toBe(200);
      });

      it('should return user data from token', async () => {
         // Arrange
         const userData = {
            firstName: 'karan',
            lastName: 'C',
            email: 'karan@gmail.com',
            password: 'secrets12',
         };
         // Act
         const userRepository = new AuthRepository(connection.getRepository(User));
         const data = await userRepository.save({ ...userData, role: Roles.CUSTOMER });
         // Generate token

         const accessToken = jwks.token({ sub: String(data.id), role: data.role });

         // add token to cookie
         const response = await request(app)
            .get('/auth/self')
            .set('Cookie', [`accessToken=${accessToken};`])
            .send();

         // Assert if user id matches with response id

         expect(response.body.id).toBe(Number(data.id));
      });
   });
});
