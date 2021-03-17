export class InternalServerError extends Error {
  constructor(stack?: string) {
    super(
      'Internal Server Error: An unexpected error has occurred. Try again later!'
    );

    this.name = 'InternalServerError';
    this.stack = stack;
  }
}
