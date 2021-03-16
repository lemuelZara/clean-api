import request from 'supertest';

import app from '../config/app';

describe('SignUp Routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Lemuel Coelho Zara',
        email: 'lemuel.czara@gmail.com',
        password: 'abc123',
        passwordConfirmation: 'abc123'
      })
      .expect(200);
  });
});
