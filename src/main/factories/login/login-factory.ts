import env from '../../config/env';
import { makeLoginValidation } from './login-validation-factory';
import { Controller } from '../../../presentation/protocols';
import { LoginController } from '../../../presentation/controllers/login/login-controller';
import { LogControllerDecorator } from '../../decorators/log-controller-decorator';
import { LogMongoRepository } from '../../../infra/database/mongodb/log/log-mongo-repository';
import { DbAuthentication } from '../../../data/use-cases/authentication/db-authentication';
import { AccountMongoRepository } from '../../../infra/database/mongodb/account/account-mongo-repository';
import { BcryptAdapter } from '../../../infra/crypto/bcrypt-adapter/bcrypt-adapter';
import { JWTAdapter } from '../../../infra/crypto/jwt-adapter/jwt-adapter';

export const makeLoginController = (): Controller => {
  const salt = 12;

  const jwtAdapter = new JWTAdapter(env.jwtSecret);
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  );

  const loginController = new LoginController(
    dbAuthentication,
    makeLoginValidation()
  );

  const logMongoRepository = new LogMongoRepository();

  return new LogControllerDecorator(loginController, logMongoRepository);
};
