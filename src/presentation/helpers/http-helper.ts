import { HttpResponse } from '../protocols/http';

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