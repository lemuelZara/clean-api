import { Authentication } from '../../../domain/use-cases/authentication';
import { InvalidParamError, MissingParamError } from '../../errors';
import {
  badRequest,
  internalServerError,
  ok,
  unprocessableEntity
} from '../../helpers/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { EmailValidator } from '../signup/signup-protocols';

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;

  private readonly authentication: Authentication;

  constructor(emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator;
    this.authentication = authentication;
  }

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields: string[] = ['email', 'password'];

      for (let i = 0; i < requiredFields.length; i += 1) {
        if (!httpRequest.body[requiredFields[i]]) {
          return unprocessableEntity(new MissingParamError(requiredFields[i]));
        }
      }

      const { email, password } = httpRequest.body;

      const isValid = this.emailValidator.isValid(email);

      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      await this.authentication.auth(email, password);

      return ok({});
    } catch (error) {
      return internalServerError(error);
    }
  }
}
