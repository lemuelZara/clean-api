import { Validation } from '../../protocols/validation';

import { InvalidParamError } from '../../errors';

import { EmailValidator } from '../../protocols/email-validator';

export class EmailValidation implements Validation {
  private readonly fieldName: string;

  private readonly emailValidator: EmailValidator;

  constructor(fieldName: string, emailValidator: EmailValidator) {
    this.fieldName = fieldName;
    this.emailValidator = emailValidator;
  }

  validate(inputData: any): Error {
    const emailIsValid = this.emailValidator.isValid(inputData[this.fieldName]);

    if (!emailIsValid) {
      return new InvalidParamError(this.fieldName);
    }

    return null;
  }
}
