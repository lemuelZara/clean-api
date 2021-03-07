import { HttpRequest, HttpResponse } from '../protocols/http';

import { MissingParamError } from '../errors/missing-param-error';

import { unprocessableEntity } from '../helpers/http-helper';

export class SignUpController {
  public handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields: string[] = ['name', 'email'];

    for (let i = 0; i < requiredFields.length; i += 1) {
      if (!httpRequest.body[requiredFields[i]]) {
        return unprocessableEntity(new MissingParamError(requiredFields[i]));
      }
    }

    return {
      statusCode: 200,
      body: {}
    };
  }
}
