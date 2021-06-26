import { Validation } from '../../protocols/validation';

import { InvalidParamError } from '../../errors';

export class CompareFieldsValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldToCompareName: string
  ) {}

  validate(inputData: any): Error {
    if (inputData[this.fieldName] !== inputData[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName);
    }

    return null;
  }
}
