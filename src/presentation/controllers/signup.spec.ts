import { SignUpController } from './signup';

describe('SignUp Controller', () => {
  test('Should be return 400 if no name is provided', () => {
    const SUT = new SignUpController();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const httpResponse = SUT.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
  });
});