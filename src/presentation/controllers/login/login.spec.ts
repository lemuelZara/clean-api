import { LoginController } from './login';
import {
  internalServerError,
  ok,
  unauthorized,
  unprocessableEntity
} from '../../helpers/http/http-helper';
import { MissingParamError } from '../../errors';
import {
  HttpRequest,
  Authentication,
  AuthenticationModel,
  Validation
} from './login-protocols';

interface SutTypes {
  sut: LoginController;
  stubAuthentication: Authentication;
  stubValidation: Validation;
}

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  };
};

const makeAuthentication = (): Authentication => {
  class StubAuthentication implements Authentication {
    auth(authentication: AuthenticationModel): Promise<string> {
      return new Promise((resolve) => resolve('any_token'));
    }
  }

  return new StubAuthentication();
};

const makeValidation = (): Validation => {
  class StubValidators implements Validation {
    validate(inputData: any): Error {
      return null;
    }
  }

  return new StubValidators();
};

const makeSut = (): SutTypes => {
  const stubAuthentication = makeAuthentication();
  const stubValidation = makeValidation();
  const sut = new LoginController(stubAuthentication, stubValidation);

  return {
    sut,
    stubAuthentication,
    stubValidation
  };
};

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, stubAuthentication } = makeSut();

    const authSpy = jest.spyOn(stubAuthentication, 'auth');

    await sut.handle(makeFakeRequest());

    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password'
    });
  });

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, stubAuthentication } = makeSut();

    jest
      .spyOn(stubAuthentication, 'auth')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(unauthorized());
  });

  test('Should return 500 if Authentication throws', async () => {
    const { sut, stubAuthentication } = makeSut();

    jest
      .spyOn(stubAuthentication, 'auth')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(internalServerError(new Error()));
  });

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(
      ok({
        accessToken: 'any_token'
      })
    );
  });

  test('Should call Validation with correct value', async () => {
    const { sut, stubValidation } = makeSut();

    const validateSpy = jest.spyOn(stubValidation, 'validate');

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('Should return 422 if Validation returns an error', async () => {
    const { sut, stubValidation } = makeSut();

    jest
      .spyOn(stubValidation, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'));

    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      unprocessableEntity(new MissingParamError('any_field'))
    );
  });
});
