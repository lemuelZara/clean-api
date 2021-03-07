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

import { AddAccount } from '../../domain/use-cases/add-account';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  private readonly addAccount: AddAccount;

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
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

      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      const emailIsValid = this.emailValidator.isValid(email);

      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'));
      }

      this.addAccount.add({
        name,
        email,
        password
      });

      return {
        statusCode: 200,
        body: {}
      };
    } catch (error) {
      return internalServerError();
    }
  }
}
