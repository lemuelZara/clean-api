import { makeLoginValidation } from './login-validation';

import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite';
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation';
import { Validation } from '../../../presentation/helpers/validators/validation';
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation';
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
