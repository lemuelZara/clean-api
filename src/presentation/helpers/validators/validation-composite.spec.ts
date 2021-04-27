import { ValidationComposite } from './validation-composite';

import { MissingParamError } from '../../errors';
import { Validation } from './validation';

interface SutTypes {
  sut: ValidationComposite;
  stubValidation: Validation;
}

const makeValidation = (): Validation => {
  class StubValidation implements Validation {
    validate(inputData: any): Error {
      return null;
    }
  }

  return new StubValidation();
};

const makeSut = (): SutTypes => {
  const stubValidation = makeValidation();
  const sut = new ValidationComposite([stubValidation]);

  return {
    sut,
    stubValidation
  };
};

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, stubValidation } = makeSut();

    jest
      .spyOn(stubValidation, 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));

    const error = sut.validate({
      field: 'any_value'
    });

    expect(error).toEqual(new MissingParamError('field'));
  });
});
