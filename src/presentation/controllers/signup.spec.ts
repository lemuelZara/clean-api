import { SignUpController } from './signup';

import {
  MissingParamError,
  InvalidParamError,
  InternalServerError
} from '../errors';

import { EmailValidator } from '../protocols';

import { AccountModel } from '../../domain/models/account';
import {
  AddAccount,
  AddAccountModel
} from '../../domain/use-cases/add-account';

interface SutTypes {
  sut: SignUpController;
  stubEmailValidator: EmailValidator;
  stubAddAccount: AddAccount;
}

const makeEmailValidator = (): EmailValidator => {
  class StubEmailValidator implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new StubEmailValidator();
};

const makeAddAccount = (): AddAccount => {
  class StubAddAccount implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      };

      return fakeAccount;
    }
  }

  return new StubAddAccount();
};

const makeSut = (): SutTypes => {
  const stubEmailValidator = makeEmailValidator();
  const stubAddAccount = makeAddAccount();

  const sut = new SignUpController(stubEmailValidator, stubAddAccount);

  return {
    sut,
    stubEmailValidator,
    stubAddAccount
  };
};

describe('SignUp Controller', () => {
  test('Should be return 422 if no name is provided', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(422);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  test('Should be return 422 if no email is provided', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(422);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  test('Should be return 422 if no password is provided', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(422);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  test('Should be return 422 if no password confirmation is provided', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(422);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    );
  });

  test('Should be return 400 if no password confirmation fails', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation')
    );
  });

  test('Should be return 400 if an invalid email is provided', () => {
    const { sut, stubEmailValidator } = makeSut();

    jest.spyOn(stubEmailValidator, 'isValid').mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  test('Should call EmailValidator if correct email', () => {
    const { sut, stubEmailValidator } = makeSut();

    const emailIsValidSpy = jest.spyOn(stubEmailValidator, 'isValid');

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };

    sut.handle(httpRequest);

    expect(emailIsValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should return 500 if EmailValidator throws', () => {
    const { sut, stubEmailValidator } = makeSut();

    jest.spyOn(stubEmailValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new InternalServerError());
  });

  test('Should call AddAccount if correct values', () => {
    const { sut, stubAddAccount } = makeSut();

    const addAccountSpy = jest.spyOn(stubAddAccount, 'add');

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };

    sut.handle(httpRequest);

    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    });
  });
});
