import { HttpRequest, HttpResponse } from '../protocols/http';
import { Controller } from '../protocols/controller';
import { EmailValidator } from '../protocols/email-validator';

import { MissingParamError } from '../errors/missing-param-error';
import { InvalidParamError } from '../errors/invalid-param-error';
import { InternalServerError } from '../errors/internal-server-error';

import { unprocessableEntity, badRequest } from '../helpers/http-helper';

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

      const emailIsValid = this.emailValidator.isValid(httpRequest.body.email);

      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'));
      }

      return {
        statusCode: 200,
        body: {}
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: new InternalServerError()
      };
    }
  }
}
