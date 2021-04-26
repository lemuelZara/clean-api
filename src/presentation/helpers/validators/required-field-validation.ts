import { Validation } from './validation';

import { MissingParamError } from '../../errors';

export class RequiredFieldValidation implements Validation {
  private readonly fieldName: string;

  constructor(fieldName: string) {
    this.fieldName = fieldName;
  }

  validate(inputData: any): Error {
    if (!inputData[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }

    return null;
  }
}
