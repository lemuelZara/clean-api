import validator from 'validator';

import { EmailValidatorAdapter } from './email-validator-adapter';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  }
}));

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

describe('EmailValidatorAdapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = makeSut();

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);

    const emailIsValid = sut.isValid('invalid_email@mail.com');

    expect(emailIsValid).toBe(false);
  });

  test('Should return true if validator returns true', () => {
    const sut = makeSut();

    const emailIsValid = sut.isValid('valid_email@mail.com');

    expect(emailIsValid).toBe(true);
  });

  test('Should call validator with correct email', () => {
    const sut = makeSut();

    const isEmailSpy = jest.spyOn(validator, 'isEmail');

    sut.isValid('any_email@mail.com');

    expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
