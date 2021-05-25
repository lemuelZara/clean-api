import {
  Authentication,
  AuthenticationModel
} from '../../../domain/use-cases/authentication';
import { HashCompare } from '../../protocols/crypto/hash-compare';
import { LoadAccountByEmailRepository } from '../../protocols/database/load-account-by-email-repository';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;

  private readonly hashCompare: HashCompare;

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompare: HashCompare
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashCompare = hashCompare;
  }

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email
    );

    if (account) {
      await this.hashCompare.compare(authentication.password, account.password);
    }

    return null;
  }
}
