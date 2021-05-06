import { DbAuthentication } from './db-authentication';
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository';
import { AccountModel } from '../add-account/db-add-account-protocols';

describe('DbAuthentication Usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct value', async () => {
    class StubLoadAccountByEmailRepository
      implements LoadAccountByEmailRepository {
      load(email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password'
        };

        return new Promise((resolve) => resolve(account));
      }
    }

    const stubLoadAccountByEmailRepository = new StubLoadAccountByEmailRepository();
    const sut = new DbAuthentication(stubLoadAccountByEmailRepository);

    const loadSpy = jest.spyOn(stubLoadAccountByEmailRepository, 'load');

    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password'
    });

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
