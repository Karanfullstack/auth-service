import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import createJWKS from 'mock-jwks';
import { RefreshToken } from '../../src/entity/RefreshToken';
import { User } from '../../src/entity/User';
import TokenService from '../../src/services/TokenService';
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
      it('should save refresh token and access token in the cookie', async () => {
         interface Headers {
            ['set-cookie']: string[];
         }
         const userData = {
            firstName: 'karan',
            lastName: 'C',
            email: 'karan@gmail.com',
            password: 'secrets12',
         };

         const userRepository = AppDataSource.getRepository(User);

         const user = await userRepository.save({ ...userData, role: 'customer' });

         const repository = AppDataSource.getRepository(RefreshToken);
         const persistToken = await new TokenService(repository).persistRefreshToken(user);

         const refreshToken = new TokenService(repository).generateRefreshToken(
            {
               sub: String(user.id),
               role: 'customer',
            },
            persistToken.id,
         );

         const response = await request(app)
            .post('/auth/refresh')
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .send();

         expect(response.body.refreshTokenID).toBe(String(persistToken.id));
      });
   });

   describe('Missig fields', () => {});
});
