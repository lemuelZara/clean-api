import { LogControllerDecorator } from './log';

import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols';
import {
  internalServerError,
  ok
} from '../../presentation/helpers/http/http-helper';

import { LogErrorRepository } from '../../data/protocols/log-error-repository';

import { AccountModel } from '../../domain/models/account';

interface SutTypes {
  sut: LogControllerDecorator;
  stubController: Controller;
  stubLogErrorRepository: LogErrorRepository;
}

const makeFakeInternalServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';

  return internalServerError(fakeError);
};

const makeFakeAccount = (): AccountModel => {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
  };
};

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: '123',
      passwordConfirmation: '123'
    }
  };
};

const makeController = (): Controller => {
  class StubController implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse = ok(makeFakeAccount());

      return new Promise((resolve) => resolve(httpResponse));
    }
  }

  return new StubController();
};

const makeLogErrorRepository = (): LogErrorRepository => {
  class StubLogErrorRepository implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }

  return new StubLogErrorRepository();
};

const makeSut = (): SutTypes => {
  const stubController = makeController();
  const stubLogErrorRepository = makeLogErrorRepository();

  const sut = new LogControllerDecorator(
    stubController,
    stubLogErrorRepository
  );

  return {
    sut,
    stubController,
    stubLogErrorRepository
  };
};

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, stubController } = makeSut();

    const handleSpy = jest.spyOn(stubController, 'handle');

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut();

    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });

  test('Should call LogErrorRepository with correct error if controller returns a internal server error', async () => {
    const { sut, stubController, stubLogErrorRepository } = makeSut();

    const fakeError = makeFakeInternalServerError();

    const logSpy = jest.spyOn(stubLogErrorRepository, 'logError');
    jest
      .spyOn(stubController, 'handle')
      .mockReturnValueOnce(new Promise((resolve) => resolve(fakeError)));

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
