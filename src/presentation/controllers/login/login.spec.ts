import { LoginController } from './login';
import {
  badRequest,
  internalServerError,
  unprocessableEntity
} from '../../helpers/http-helper';
import { InvalidParamError, MissingParamError } from '../../errors';
import { EmailValidator, HttpRequest } from '../signup/signup-protocols';
import { Authentication } from '../../../domain/use-cases/authentication';

interface SutTypes {
  sut: LoginController;
  stubEmailValidator: EmailValidator;
  stubAuthentication: Authentication;
}

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  };
};

const makeEmailValidator = (): EmailValidator => {
  class StubEmailValidator implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new StubEmailValidator();
};

const makeAuthentication = (): Authentication => {
  class StubAuthentication implements Authentication {
    auth(email: string, password: string): Promise<string> {
      return new Promise((resolve) => resolve('any_token'));
    }
  }

  return new StubAuthentication();
};

const makeSut = (): SutTypes => {
  const stubEmailValidator = makeEmailValidator();
  const stubAuthentication = makeAuthentication();
  const sut = new LoginController(stubEmailValidator, stubAuthentication);

  return {
    sut,
    stubEmailValidator,
    stubAuthentication
  };
};

describe('Login Controller', () => {
  test('Should return 422 if no email is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        password: 'any_password'
      }
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      unprocessableEntity(new MissingParamError('email'))
    );
  });

  test('Should return 422 if no password is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      unprocessableEntity(new MissingParamError('password'))
    );
  });

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, stubEmailValidator } = makeSut();

    jest.spyOn(stubEmailValidator, 'isValid').mockReturnValueOnce(false);

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  test('Should call EmailValidator with correct email', async () => {
    const { sut, stubEmailValidator } = makeSut();

    const isValidSpy = jest.spyOn(stubEmailValidator, 'isValid');

    await sut.handle(makeFakeRequest());

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, stubEmailValidator } = makeSut();

    jest.spyOn(stubEmailValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(internalServerError(new Error()));
  });

  test('Should call Authentication with correct values', async () => {
    const { sut, stubAuthentication } = makeSut();

    const authSpy = jest.spyOn(stubAuthentication, 'auth');

    await sut.handle(makeFakeRequest());

    expect(authSpy).toHaveBeenCalledWith('any_email@mail.com', 'any_password');
  });
});
