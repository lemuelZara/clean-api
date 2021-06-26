import { Validation } from '../../protocols/validation';

import { MissingParamError } from '../../errors';

export class RequiredFieldValidation implements Validation {
  constructor(private readonly fieldName: string) {}

  validate(inputData: any): Error {
    if (!inputData[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }

    return null;
  }
}
