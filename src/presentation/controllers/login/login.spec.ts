import { LoginController } from './login';
import { badRequest } from '../../helpers/http-helper';
import { InvalidParamError, MissingParamError } from '../../errors';
import { EmailValidator } from '../signup/signup-protocols';

interface SutTypes {
  sut: LoginController;
  stubEmailValidator: EmailValidator;
}

const makeEmailValidator = (): EmailValidator => {
  class StubEmailValidator implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new StubEmailValidator();
};

const makeSut = (): SutTypes => {
  const stubEmailValidator = makeEmailValidator();
  const sut = new LoginController(stubEmailValidator);

  return {
    sut,
    stubEmailValidator
  };
};

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        password: 'any_password'
      }
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, stubEmailValidator } = makeSut();

    jest.spyOn(stubEmailValidator, 'isValid').mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  test('Should call EmailValidator with correct email', async () => {
    const { sut, stubEmailValidator } = makeSut();

    const isValidSpy = jest.spyOn(stubEmailValidator, 'isValid');

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    };

    await sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
