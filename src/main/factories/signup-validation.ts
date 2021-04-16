import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation-';
import { Validation } from '../../presentation/helpers/validators/validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';

export const makeSignUpValidation = (): ValidationComposite => {
  const fields = ['name', 'email', 'password', 'passwordConfirmation'];
  const validations: Validation[] = [];

  for (let i = 0; i < fields.length; i += 1) {
    validations.push(new RequiredFieldValidation(fields[i]));
  }

  return new ValidationComposite(validations);
};
