import { DbAuthentication } from './db-authentication';
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository';
import { AccountModel } from '../add-account/db-add-account-protocols';
import { AuthenticationModel } from '../../../domain/use-cases/authentication';

interface SutTypes {
  stubLoadAccountByEmailRepository: LoadAccountByEmailRepository;
  sut: DbAuthentication;
}

const makeFakeAccount = (): AccountModel => {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
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

const makeSut = (): SutTypes => {
  const stubLoadAccountByEmailRepository = makeLoadAccountByEmailRepository();
  const sut = new DbAuthentication(stubLoadAccountByEmailRepository);

  return {
    stubLoadAccountByEmailRepository,
    sut
  };
};

describe('DbAuthentication Usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct value', async () => {
    const { stubLoadAccountByEmailRepository, sut } = makeSut();

    const loadSpy = jest.spyOn(stubLoadAccountByEmailRepository, 'load');

    await sut.auth(makeFakeAuthentication());

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
