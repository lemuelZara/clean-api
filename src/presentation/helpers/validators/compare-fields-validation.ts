import { Validation } from './validation';

import { InvalidParamError } from '../../errors';

export class CompareFieldsValidation implements Validation {
  private readonly fieldName: string;

  private readonly fieldToCompareName: string;

  constructor(fieldName: string, fieldToCompareName: string) {
    this.fieldName = fieldName;
    this.fieldToCompareName = fieldToCompareName;
  }

  validate(inputData: any): Error {
    if (inputData[this.fieldName] !== inputData[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName);
    }

    return null;
  }
}
