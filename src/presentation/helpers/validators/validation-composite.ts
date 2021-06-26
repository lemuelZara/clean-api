import { Validation } from '../../protocols/validation';

export class ValidationComposite implements Validation {
  constructor(private readonly validators: Validation[]) {}

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
