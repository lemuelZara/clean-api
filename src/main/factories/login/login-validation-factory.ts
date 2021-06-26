import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '../../../presentation/helpers/validators';
import { Validation } from '../../../presentation/protocols/validation';
import { EmailValidatorAdapter } from '../../adapters/validators/email-validator-adapter';

export const makeLoginValidation = (): ValidationComposite => {
  const fields = ['email', 'password'];
  const validations: Validation[] = [];

  for (let i = 0; i < fields.length; i += 1) {
    validations.push(new RequiredFieldValidation(fields[i]));
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};
