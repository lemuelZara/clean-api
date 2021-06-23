import jwt from 'jsonwebtoken';

import { JWTAdapter } from './jwt-adapter';

describe('JWT Adapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = new JWTAdapter('secret');

    const signSpy = jest.spyOn(jwt, 'sign');

    await sut.encrypt('any_id');

    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
  });
});
