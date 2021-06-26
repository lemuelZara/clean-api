import {
  HttpRequest,
  HttpResponse,
  Controller,
  AddAccount,
  Validation
} from './signup-controller-protocols';

import {
  internalServerError,
  ok,
  badRequest
} from '../../helpers/http/http-helper';

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const { name, email, password } = httpRequest.body;

      const account = await this.addAccount.add({
        name,
        email,
        password
      });

      return ok(account);
    } catch (error) {
      return internalServerError(error);
    }
  }
}
