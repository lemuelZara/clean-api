import { DbAuthentication } from './db-authentication';
import {
  AccountModel,
  LoadAccountByEmailRepository,
  AuthenticationModel,
  HashCompare,
  TokenGenerator,
  UpdateAccessTokenRepository
} from './db-authentication-protocols';

interface SutTypes {
  stubLoadAccountByEmailRepository: LoadAccountByEmailRepository;
  stubHashCompare: HashCompare;
  stubTokenGenerator: TokenGenerator;
  stubUpdateAccessTokenRepository: UpdateAccessTokenRepository;
  sut: DbAuthentication;
}

const makeFakeAccount = (): AccountModel => {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password'
  };
};

const makeFakeAuthentication = (): AuthenticationModel => {
  return {
    email: 'any_email@mail.com',
    password: 'any_password'
  };
};

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class StubLoadAccountByEmailRepository
    implements LoadAccountByEmailRepository {
    load(email: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }

  return new StubLoadAccountByEmailRepository();
};

const makeHashCompare = (): HashCompare => {
  class StubHashCompare implements HashCompare {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }

  return new StubHashCompare();
};

const makeTokenGenerator = (): TokenGenerator => {
  class StubTokenGenerator implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return new Promise((resolve) => resolve('any_token'));
    }
  }

  return new StubTokenGenerator();
};

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class StubUpdateAccessTokenRepository implements UpdateAccessTokenRepository {
    async update(id: string, token: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }

  return new StubUpdateAccessTokenRepository();
};

const makeSut = (): SutTypes => {
  const stubLoadAccountByEmailRepository = makeLoadAccountByEmailRepository();
  const stubHashCompare = makeHashCompare();
  const stubTokenGenerator = makeTokenGenerator();
  const stubUpdateAccessTokenRepository = makeUpdateAccessTokenRepository();
  const sut = new DbAuthentication(
    stubLoadAccountByEmailRepository,
    stubHashCompare,
    stubTokenGenerator,
    stubUpdateAccessTokenRepository
  );

  return {
    stubLoadAccountByEmailRepository,
    stubHashCompare,
    stubTokenGenerator,
    stubUpdateAccessTokenRepository,
    sut
  };
};

describe('DbAuthentication Usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { stubLoadAccountByEmailRepository, sut } = makeSut();

    const loadSpy = jest.spyOn(stubLoadAccountByEmailRepository, 'load');

    await sut.auth(makeFakeAuthentication());

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { stubLoadAccountByEmailRepository, sut } = makeSut();

    jest
      .spyOn(stubLoadAccountByEmailRepository, 'load')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.auth(makeFakeAuthentication());

    await expect(promise).rejects.toThrow();
  });

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { stubLoadAccountByEmailRepository, sut } = makeSut();

    jest
      .spyOn(stubLoadAccountByEmailRepository, 'load')
      .mockReturnValueOnce(null);

    const accessToken = await sut.auth(makeFakeAuthentication());

    expect(accessToken).toBeNull();
  });

  test('Should call HashCompare with correct values', async () => {
    const { stubHashCompare, sut } = makeSut();

    const compareSpy = jest.spyOn(stubHashCompare, 'compare');

    await sut.auth(makeFakeAuthentication());

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password');
  });

  test('Should throw if HashCompare throws', async () => {
    const { stubHashCompare, sut } = makeSut();

    jest
      .spyOn(stubHashCompare, 'compare')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.auth(makeFakeAuthentication());

    await expect(promise).rejects.toThrow();
  });

  test('Should return null if HashCompare returns false', async () => {
    const { stubHashCompare, sut } = makeSut();

    jest
      .spyOn(stubHashCompare, 'compare')
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)));

    const accessToken = await sut.auth(makeFakeAuthentication());

    expect(accessToken).toBeNull();
  });

  test('Should call TokenGenerator with correct id', async () => {
    const { stubTokenGenerator, sut } = makeSut();

    const generateSpy = jest.spyOn(stubTokenGenerator, 'generate');

    await sut.auth(makeFakeAuthentication());

    expect(generateSpy).toBeCalledWith('any_id');
  });

  test('Should throw if TokenGenerate throws', async () => {
    const { stubTokenGenerator, sut } = makeSut();

    jest
      .spyOn(stubTokenGenerator, 'generate')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.auth(makeFakeAuthentication());

    await expect(promise).rejects.toThrow();
  });

  test('Should call TokenGenerator with correct id', async () => {
    const { sut } = makeSut();

    const accessToken = await sut.auth(makeFakeAuthentication());

    expect(accessToken).toBe('any_token');
  });

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { stubUpdateAccessTokenRepository, sut } = makeSut();

    const updateSpy = jest.spyOn(stubUpdateAccessTokenRepository, 'update');

    await sut.auth(makeFakeAuthentication());

    expect(updateSpy).toBeCalledWith('any_id', 'any_token');
  });

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { stubUpdateAccessTokenRepository, sut } = makeSut();

    jest
      .spyOn(stubUpdateAccessTokenRepository, 'update')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.auth(makeFakeAuthentication());

    await expect(promise).rejects.toThrow();
  });
});
