import request from 'supertest';
import { Collection } from 'mongodb';
import { hash } from 'bcrypt';

import app from '../config/app';

import { MongoHelper } from '../../infra/database/mongodb/helpers/mongo-helper';

let accountCollection: Collection;

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');

    await accountCollection.deleteMany({});
  });

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
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

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('abc123', 12);

      await accountCollection.insertOne({
        name: 'Lemuel Coelho Zara',
        email: 'lemuel.czara@gmail.com',
        password
      });

      await request(app)
        .post('/api/login')
        .send({
          email: 'lemuel.czara@gmail.com',
          password: 'abc123'
        })
        .expect(200);
    });
  });
});
