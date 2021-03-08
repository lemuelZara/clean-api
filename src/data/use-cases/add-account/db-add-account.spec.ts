import { DbAddAccount } from './db-add-account';

import {
  Encrypter,
  AddAccountModel,
  AccountModel,
  AddAccountRepository
} from './db-add-account-protocols';

interface SutTypes {
  sut: DbAddAccount;
  stubEncrypter: Encrypter;
  stubAddAccountRepository: AddAccountRepository;
}

const makeEncrypter = (): Encrypter => {
  class StubEncrypter implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'));
    }
  }

  return new StubEncrypter();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class StubAddAccountRepository implements AddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password'
      };

      return new Promise((resolve) => resolve(fakeAccount));
    }
  }

  return new StubAddAccountRepository();
};

const makeSut = (): SutTypes => {
  const stubEncrypter = makeEncrypter();
  const stubAddAccountRepository = makeAddAccountRepository();

  const sut = new DbAddAccount(stubEncrypter, stubAddAccountRepository);

  return {
    sut,
    stubEncrypter,
    stubAddAccountRepository
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

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, stubAddAccountRepository } = makeSut();

    const addSpy = jest.spyOn(stubAddAccountRepository, 'add');

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    };

    await sut.add(accountData);

    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    });
  });
});
