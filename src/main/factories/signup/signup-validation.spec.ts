import { makeSignUpValidation } from './signup-validation';

import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite';
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation';
import { Validation } from '../../../presentation/helpers/validators/validation';
import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compare-fields-validation';
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

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposity with all Validators', () => {
    makeSignUpValidation();

    const fields = ['name', 'email', 'password', 'passwordConfirmation'];
    const validations: Validation[] = [];

    for (let i = 0; i < fields.length; i += 1) {
      validations.push(new RequiredFieldValidation(fields[i]));
    }

    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation')
    );

    validations.push(new EmailValidation('email', makeEmailValidator()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
