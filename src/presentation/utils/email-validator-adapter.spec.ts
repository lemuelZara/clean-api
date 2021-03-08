import validator from 'validator';

import { EmailValidatorAdapter } from './email-validator-adapter';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  }
}));

describe('EmailValidatorAdapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter();

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);

    const emailIsValid = sut.isValid('invalid_email@mail.com');

    expect(emailIsValid).toBe(false);
  });

  test('Should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter();

    const emailIsValid = sut.isValid('valid_email@mail.com');

    expect(emailIsValid).toBe(true);
  });
});
