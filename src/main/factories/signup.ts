import { SignUpController } from '../../presentation/controllers/signup/signup';
import { EmailValidatorAdapter } from '../../presentation/utils/email-validator-adapter';

import { DbAddAccount } from '../../data/use-cases/add-account/db-add-account';

import { BcryptAdapter } from '../../infra/crypto/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/database/mongodb/account-repository/account';

export const makeSignUpController = (): SignUpController => {
  const salt = 12;

  const emailValidatorAdapter = new EmailValidatorAdapter();

  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const addAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);

  return new SignUpController(emailValidatorAdapter, addAccount);
};
