import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator
} from '../protocols';

import { MissingParamError, InvalidParamError } from '../errors';

import {
  unprocessableEntity,
  badRequest,
  internalServerError
} from '../helpers/http-helper';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  public handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields: string[] = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ];

      for (let i = 0; i < requiredFields.length; i += 1) {
        if (!httpRequest.body[requiredFields[i]]) {
          return unprocessableEntity(new MissingParamError(requiredFields[i]));
        }
      }

      const { email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      const emailIsValid = this.emailValidator.isValid(email);

      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'));
      }

      return {
        statusCode: 200,
        body: {}
      };
    } catch (error) {
      return internalServerError();
    }
  }
}
