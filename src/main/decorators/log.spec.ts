import { LogControllerDecorator } from './log';

import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols';

interface SutTypes {
  sut: LogControllerDecorator;
  stubController: Controller;
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

const makeSut = (): SutTypes => {
  const stubController = makeController();

  const sut = new LogControllerDecorator(stubController);

  return {
    sut,
    stubController
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
});
