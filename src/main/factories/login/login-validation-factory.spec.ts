import { makeLoginValidation } from './login-validation-factory';

import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '../../../presentation/helpers/validators';
import { Validation } from '../../../presentation/protocols/validation';
import { EmailValidator } from '../../../presentation/protocols/email-validator';

jest.mock('../../../presentation/helpers/validators/validation-composite');

const makeEmailValidator = (): EmailValidator => {
  class StubEmailValidator implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new StubEmailValidator();
};

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposity with all Validators', () => {
    makeLoginValidation();

    const fields = ['email', 'password'];
    const validations: Validation[] = [];

    for (let i = 0; i < fields.length; i += 1) {
      validations.push(new RequiredFieldValidation(fields[i]));
    }

    validations.push(new EmailValidation('email', makeEmailValidator()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
