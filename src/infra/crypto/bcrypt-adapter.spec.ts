import bcrypt from 'bcrypt';

import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('hash'));
  }
}));

describe('Bcrypt Adapter', () => {
  test('Should call Bcrypt with correct values', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);

    const bcryptSpy = jest.spyOn(bcrypt, 'hash');

    await sut.encrypt('any_value');

    expect(bcryptSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('Should return a hash on success', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);

    const hash = await sut.encrypt('any_value');

    expect(hash).toBe('hash');
  });
});
