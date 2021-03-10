import bcrypt from 'bcrypt';

import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('hash'));
  }
}));

const salt = 12;

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe('Bcrypt Adapter', () => {
  test('Should call Bcrypt with correct values', async () => {
    const sut = makeSut();

    const bcryptSpy = jest.spyOn(bcrypt, 'hash');

    await sut.encrypt('any_value');

    expect(bcryptSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('Should return a hash on success', async () => {
    const sut = makeSut();

    const hash = await sut.encrypt('any_value');

    expect(hash).toBe('hash');
  });

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut();

    jest
      .spyOn(bcrypt, 'hash')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const hashPromise = sut.encrypt('any_value');

    await expect(hashPromise).rejects.toThrow();
  });
});
