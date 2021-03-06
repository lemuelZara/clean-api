import { AddAccountRepository } from '../../../../data/protocols/database/account/add-account-repository';
import { LoadAccountByEmailRepository } from '../../../../data/protocols/database/account/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '../../../../data/protocols/database/account/update-access-token-repository';

import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/use-cases/add-account';

import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const result = await accountCollection.insertOne(accountData);
    const account = result.ops[0];

    return MongoHelper.mapping(account);
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const account = await accountCollection.findOne({ email });

    return account && MongoHelper.mapping(account);
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    await accountCollection.updateOne(
      {
        _id: id
      },
      {
        $set: {
          accessToken: token
        }
      }
    );
  }
}
