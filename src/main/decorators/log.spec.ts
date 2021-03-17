import { LogControllerDecorator } from './log';

import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols';
import { internalServerError } from '../../presentation/helpers/http-helper';

import { LogErrorRepository } from '../../data/protocols/log-error-repository';

interface SutTypes {
  sut: LogControllerDecorator;
  stubController: Controller;
  stubLogErrorRepository: LogErrorRepository;
}

const makeController = (): Controller => {
  class StubController implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'Lemuel'
        }
      };

      return new Promise((resolve) => resolve(httpResponse));
    }
  }

  return new StubController();
};

const makeLogErrorRepository = (): LogErrorRepository => {
  class StubLogErrorRepository implements LogErrorRepository {
    async log(stack: string): Promise<void> {
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

    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: '123',
        passwordConfirmation: '123'
      }
    };

    await sut.handle(httpRequest);

    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut();

    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: '123',
        passwordConfirmation: '123'
      }
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'Lemuel'
      }
    });
  });

  test('Should call LogErrorRepository with correct error if controller returns a internal server error', async () => {
    const { sut, stubController, stubLogErrorRepository } = makeSut();

    const fakeError = new Error();
    fakeError.stack = 'any_stack';

    const error = internalServerError(fakeError);

    const logSpy = jest.spyOn(stubLogErrorRepository, 'log');
    jest
      .spyOn(stubController, 'handle')
      .mockReturnValueOnce(new Promise((resolve) => resolve(error)));

    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: '123',
        passwordConfirmation: '123'
      }
    };

    await sut.handle(httpRequest);

    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
