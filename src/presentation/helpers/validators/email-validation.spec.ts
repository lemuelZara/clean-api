import { EmailValidation } from './email-validation';

import { EmailValidator } from '../../protocols/email-validator';

import { InvalidParamError } from '../../errors';

interface SutTypes {
  sut: EmailValidation;
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

  const sut = new EmailValidation('email', stubEmailValidator);

  return {
    sut,
    stubEmailValidator
  };
};

describe('Email Validation', () => {
  test('Should return an error if EmailValidator returns false', () => {
    const { sut, stubEmailValidator } = makeSut();

    jest.spyOn(stubEmailValidator, 'isValid').mockReturnValueOnce(false);

    const error = sut.validate({ email: 'any_email@mail.com' });

    expect(error).toEqual(new InvalidParamError('email'));
  });

  test('Should call EmailValidator with correct email', () => {
    const { sut, stubEmailValidator } = makeSut();

    const emailIsValidSpy = jest.spyOn(stubEmailValidator, 'isValid');

    sut.validate({ email: 'any_email@mail.com' });

    expect(emailIsValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should throw if EmailValidator throws', () => {
    const { sut, stubEmailValidator } = makeSut();

    jest.spyOn(stubEmailValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    expect(sut.validate).toThrow();
  });
});
