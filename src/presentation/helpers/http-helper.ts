import { HttpResponse } from '../protocols';

import { InternalServerError } from '../errors';

export const badRequest = (error: Error): HttpResponse => {
  return {
    statusCode: 400,
    body: error
  };
};

export const unprocessableEntity = (error: Error): HttpResponse => {
  return {
    statusCode: 422,
    body: error
  };
};

export const internalServerError = (): HttpResponse => {
  return {
    statusCode: 500,
    body: new InternalServerError()
  };
};
