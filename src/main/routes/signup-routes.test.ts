import request from 'supertest';

import app from '../config/app';

import { MongoHelper } from '../../infra/database/mongodb/helpers/mongo-helper';

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts');

    await accountCollection.deleteMany({});
  });

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
