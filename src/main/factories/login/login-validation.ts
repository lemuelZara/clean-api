import { EmailValidation } from '../../../presentation/helpers/validators/email-validation';
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation';
import { Validation } from '../../../presentation/protocols/validation';
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite';
import { EmailValidatorAdapter } from '../../../presentation/utils/email-validator-adapter';

export const makeLoginValidation = (): ValidationComposite => {
  const fields = ['email', 'password'];
  const validations: Validation[] = [];

  for (let i = 0; i < fields.length; i += 1) {
    validations.push(new RequiredFieldValidation(fields[i]));
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};
