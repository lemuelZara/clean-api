import { makeSignUpValidation } from './signup-validation';

import { Controller } from '../../presentation/protocols';
import { SignUpController } from '../../presentation/controllers/signup/signup';

import { DbAddAccount } from '../../data/use-cases/add-account/db-add-account';

import { BcryptAdapter } from '../../infra/crypto/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/database/mongodb/account-repository/account';
import { LogMongoRepository } from '../../infra/database/mongodb/log-repository/log';

import { LogControllerDecorator } from '../decorators/log';

export const makeSignUpController = (): Controller => {
  const salt = 12;

  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const addAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);

  const signUpController = new SignUpController(
    addAccount,
    makeSignUpValidation()
  );

  const logMongoRepository = new LogMongoRepository();

  return new LogControllerDecorator(signUpController, logMongoRepository);
};
