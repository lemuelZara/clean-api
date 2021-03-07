import { HttpRequest, HttpResponse } from '../protocols/http';

import { MissingParamError } from '../errors/missing-param-error';

import { unprocessableEntity } from '../helpers/http-helper';

export class SignUpController {
  public handle(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return unprocessableEntity(new MissingParamError('name'));
    }

    if (!httpRequest.body.email) {
      return unprocessableEntity(new MissingParamError('email'));
    }

    return {
      statusCode: 200,
      body: {}
    };
  }
}
