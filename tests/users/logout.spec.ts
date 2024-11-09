import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import createJWKS from 'mock-jwks';
import { Roles } from '../../src/constants';
import request from 'supertest';
import app from '../../src/app';
import { RefreshToken } from '../../src/entity/RefreshToken';

describe('POST /auth/logout', () => {
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
      it('should remove the refresh token from the database', async () => {
         interface Header {
            ['set-cookie']: string[];
         }
         const userData = {
            firstName: 'karan',
            lastName: 'chauhan',
            email: 'karan@gmail.com',
            password: 'karankarakarn',
            role: Roles.CUSTOMER,
         };
         const registerResonse = await request(app).post('/auth/register').send(userData);

         let refreshToken: null | string = null;
         const accessToken = jwks.token({ sub: String('1'), role: userData.role });
         const cookies = (registerResonse.headers as unknown as Header)['set-cookie'];

         cookies.forEach((cookie) => {
            if (cookie.startsWith('refreshToken=')) {
               refreshToken = cookie.split(';')[0].split('=')[1];
            }
         });

         const logout = await request(app)
            .post('/auth/logout')
            .set('Cookie', [`accessToken=${accessToken}; refreshToken=${refreshToken}`])
            .send();

         const refreshTokenRepo = await connection.getRepository(RefreshToken).find();
         expect(refreshTokenRepo).toHaveLength(0);
         expect(logout.statusCode).toBe(200);
      });
   });
});
