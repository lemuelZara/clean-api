import { HttpResponse } from '../../protocols';

import { InternalServerError, UnauthorizedError } from '../../errors';

export const badRequest = (error: Error): HttpResponse => {
  return {
    statusCode: 400,
    body: error
  };
};

export const unauthorized = (): HttpResponse => {
  return {
    statusCode: 401,
    body: new UnauthorizedError()
  };
};

export const unprocessableEntity = (error: Error): HttpResponse => {
  return {
    statusCode: 422,
    body: error
  };
};

export const internalServerError = (error: Error): HttpResponse => {
  return {
    statusCode: 500,
    body: new InternalServerError(error.stack)
  };
};

export const ok = (data: any): HttpResponse => {
  return {
    statusCode: 200,
    body: data
  };
};
