import { DbAddAccount } from './db-add-account';

import {
  Hasher,
  AddAccountModel,
  AccountModel,
  AddAccountRepository
} from './db-add-account-protocols';

interface SutTypes {
  sut: DbAddAccount;
  stubHasher: Hasher;
  stubAddAccountRepository: AddAccountRepository;
}

const makeFakeAccountData = (): AddAccountModel => {
  return {
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password'
  };
};

const makeFakeAccount = (): AccountModel => {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email',
    password: 'hashed_password'
  };
};

const makeHasher = (): Hasher => {
  class StubHasher implements Hasher {
    async hash(value: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'));
    }
  }

  return new StubHasher();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class StubAddAccountRepository implements AddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount();

      return new Promise((resolve) => resolve(fakeAccount));
    }
  }

  return new StubAddAccountRepository();
};

const makeSut = (): SutTypes => {
  const stubHasher = makeHasher();
  const stubAddAccountRepository = makeAddAccountRepository();

  const sut = new DbAddAccount(stubHasher, stubAddAccountRepository);

  return {
    sut,
    stubHasher,
    stubAddAccountRepository
  };
};

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, stubHasher } = makeSut();

    const hasherSpy = jest.spyOn(stubHasher, 'hash');

    const accountData = makeFakeAccountData();

    await sut.add(accountData);

    expect(hasherSpy).toHaveBeenCalledWith('valid_password');
  });

  test('Should throw if Hasher throws', async () => {
    const { sut, stubHasher } = makeSut();

    jest
      .spyOn(stubHasher, 'hash')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const accountData = makeFakeAccountData();

    const accountPromise = sut.add(accountData);

    await expect(accountPromise).rejects.toThrow();
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, stubAddAccountRepository } = makeSut();

    const addSpy = jest.spyOn(stubAddAccountRepository, 'add');

    const accountData = makeFakeAccountData();

    await sut.add(accountData);

    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    });
  });

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, stubAddAccountRepository } = makeSut();

    jest
      .spyOn(stubAddAccountRepository, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const accountData = makeFakeAccountData();

    const accountPromise = sut.add(accountData);

    await expect(accountPromise).rejects.toThrow();
  });

  test('Should return an account on success', async () => {
    const { sut } = makeSut();

    const accountData = makeFakeAccountData();

    const account = await sut.add(accountData);

    expect(account).toEqual(makeFakeAccount());
  });
});
