import { SignUpController } from './signup-controller';
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Validation
} from './signup-controller-protocols';

import { MissingParamError, InternalServerError } from '../../errors';

import { HttpRequest } from '../../protocols';

import {
  ok,
  internalServerError,
  badRequest
} from '../../helpers/http/http-helper';

interface SutTypes {
  sut: SignUpController;
  stubAddAccount: AddAccount;
  stubValidation: Validation;
}

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  };
};

const makeFakeAccount = (): AccountModel => {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
  };
};

const makeAddAccount = (): AddAccount => {
  class StubAddAccount implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount();

      return new Promise((resolve) => resolve(fakeAccount));
    }
  }

  return new StubAddAccount();
};

const makeValidation = (): Validation => {
  class StubValidaton implements Validation {
    validate(inputData: any): Error {
      return null;
    }
  }

  return new StubValidaton();
};

const makeSut = (): SutTypes => {
  const stubAddAccount = makeAddAccount();
  const stubValidation = makeValidation();

  const sut = new SignUpController(stubAddAccount, stubValidation);

  return {
    sut,
    stubAddAccount,
    stubValidation
  };
};

describe('SignUp Controller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, stubAddAccount } = makeSut();

    const addAccountSpy = jest.spyOn(stubAddAccount, 'add');

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    });
  });

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, stubAddAccount } = makeSut();

    jest.spyOn(stubAddAccount, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });

    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      internalServerError(new InternalServerError())
    );
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });

  test('Should call Validation with correct value', async () => {
    const { sut, stubValidation } = makeSut();

    const validateSpy = jest.spyOn(stubValidation, 'validate');

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, stubValidation } = makeSut();

    jest
      .spyOn(stubValidation, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'));

    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any_field'))
    );
  });
});
