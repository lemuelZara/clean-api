import { ValidationComposite } from './validation-composite';

import { MissingParamError } from '../../errors';
import { Validation } from '../../protocols/validation';

interface SutTypes {
  sut: ValidationComposite;
  stubValidations: Validation[];
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
  const stubValidations = [makeValidation(), makeValidation()];
  const sut = new ValidationComposite(stubValidations);

  return {
    sut,
    stubValidations
  };
};

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, stubValidations } = makeSut();

    jest
      .spyOn(stubValidations[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));

    const error = sut.validate({
      field: 'any_value'
    });

    expect(error).toEqual(new MissingParamError('field'));
  });

  test('Should return the first error if more then one validation fails', () => {
    const { sut, stubValidations } = makeSut();

    jest.spyOn(stubValidations[0], 'validate').mockReturnValueOnce(new Error());
    jest
      .spyOn(stubValidations[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));

    const error = sut.validate({
      field: 'any_value'
    });

    expect(error).toEqual(new Error());
  });

  test('Should not return if validation succeeds', () => {
    const { sut } = makeSut();

    const error = sut.validate({
      field: 'any_value'
    });

    expect(error).toBeFalsy();
  });
});
