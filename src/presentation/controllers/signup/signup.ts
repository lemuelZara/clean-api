import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator,
  AddAccount
} from './signup-protocols';

import { MissingParamError, InvalidParamError } from '../../errors';

import {
  unprocessableEntity,
  badRequest,
  internalServerError,
  ok
} from '../../helpers/http-helper';

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

      const account = this.addAccount.add({
        name,
        email,
        password
      });

      return ok(account);
    } catch (error) {
      return internalServerError();
    }
  }
}
