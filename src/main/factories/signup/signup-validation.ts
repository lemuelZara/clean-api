import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '../../../presentation/helpers/validators';
import { Validation } from '../../../presentation/protocols/validation';
import { EmailValidatorAdapter } from '../../../presentation/utils/email-validator-adapter';

export const makeSignUpValidation = (): ValidationComposite => {
  const fields = ['name', 'email', 'password', 'passwordConfirmation'];
  const validations: Validation[] = [];

  for (let i = 0; i < fields.length; i += 1) {
    validations.push(new RequiredFieldValidation(fields[i]));
  }

  validations.push(
    new CompareFieldsValidation('password', 'passwordConfirmation')
  );

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};
