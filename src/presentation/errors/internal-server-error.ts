export class InternalServerError extends Error {
  constructor() {
    super(
      'Internal Server Error: An unexpected error has occurred. Try again later!'
    );

    this.name = 'InternalServerError';
  }
}
