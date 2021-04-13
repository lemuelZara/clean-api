export class UnauthorizedError extends Error {
  constructor() {
    super('Access is denied due to invalid credentials!');
    this.name = 'Unauthorized';
  }
}
