import { makeSignUpValidation } from './signup-validation';

import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation-';
import { Validation } from '../../presentation/helpers/validators/validation';

jest.mock('../../presentation/helpers/validators/validation-composite');

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposity with all Validators', () => {
    makeSignUpValidation();

    const fields = ['name', 'email', 'password', 'passwordConfirmation'];
    const validations: Validation[] = [];

    for (let i = 0; i < fields.length; i += 1) {
      validations.push(new RequiredFieldValidation(fields[i]));
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
