import { Validation } from '../../protocols/validation';

import { InvalidParamError } from '../../errors';

import { EmailValidator } from '../../protocols/email-validator';

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate(inputData: any): Error {
    const emailIsValid = this.emailValidator.isValid(inputData[this.fieldName]);

    if (!emailIsValid) {
      return new InvalidParamError(this.fieldName);
    }

    return null;
  }
}
