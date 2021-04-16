import { Validation } from './validation';

export class ValidationComposite implements Validation {
  private readonly validators: Validation[];

  constructor(validators: Validation[]) {
    this.validators = validators;
  }

  validate(inputData: any): Error {
    for (let i = 0; i < this.validators.length; i += 1) {
      const error = this.validators[i].validate(inputData);

      if (error) {
        return error;
      }
    }

    return null;
  }
}
