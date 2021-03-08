import { EmailValidatorAdapter } from './email-validator-adapter';

describe('EmailValidatorAdapter', () => {
  test('Should return false if validator returns falser', () => {
    const sut = new EmailValidatorAdapter();

    const emailIsValid = sut.isValid('invalid_email@mail.com');

    expect(emailIsValid).toBe(false);
  });
});
