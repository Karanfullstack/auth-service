import request from 'supertest';
import app from './src/app';

describe.skip('App', () => {
   it('should return 200 status code', async () => {
      const result = await request(app).get('/').send();
      expect(result.statusCode).toBe(200);
   });
});
