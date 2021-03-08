import { DbAddAccount } from './db-add-account';

import { Encrypter } from './db-add-account-protocols';

interface SutTypes {
  sut: DbAddAccount;
  stubEncrypter: Encrypter;
}

const makeEncrypter = (): Encrypter => {
  class StubEncrypter implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'));
    }
  }

  return new StubEncrypter();
};

const makeSut = (): SutTypes => {
  const stubEncrypter = makeEncrypter();

  const sut = new DbAddAccount(stubEncrypter);

  return {
    sut,
    stubEncrypter
  };
};

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, stubEncrypter } = makeSut();

    const encryptSpy = jest.spyOn(stubEncrypter, 'encrypt');

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    };

    await sut.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  test('Should throw if Encrypter throws', async () => {
    const { sut, stubEncrypter } = makeSut();

    jest
      .spyOn(stubEncrypter, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    };

    const accountPromise = sut.add(accountData);

    await expect(accountPromise).rejects.toThrow();
  });
});
