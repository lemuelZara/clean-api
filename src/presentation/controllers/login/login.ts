import {
  Controller,
  HttpRequest,
  HttpResponse,
  Authentication,
  Validation
} from './login-protocols';
import {
  internalServerError,
  ok,
  unauthorized,
  unprocessableEntity
} from '../../helpers/http/http-helper';

export class LoginController implements Controller {
  private readonly authentication: Authentication;

  private readonly validation: Validation;

  constructor(authentication: Authentication, validation: Validation) {
    this.authentication = authentication;
    this.validation = validation;
  }

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return unprocessableEntity(error);
      }

      const { email, password } = httpRequest.body;

      const accessToken = await this.authentication.auth(email, password);

      if (!accessToken) {
        return unauthorized();
      }

      return ok({ accessToken });
    } catch (error) {
      return internalServerError(error);
    }
  }
}
