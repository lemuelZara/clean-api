import {
  Authentication,
  AuthenticationModel
} from '../../../domain/use-cases/authentication';
import { HashCompare } from '../../protocols/crypto/hash-compare';
import { TokenGenerator } from '../../protocols/crypto/token-generator';
import { LoadAccountByEmailRepository } from '../../protocols/database/load-account-by-email-repository';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;

  private readonly hashCompare: HashCompare;

  private readonly tokenGenerator: TokenGenerator;

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompare: HashCompare,
    tokenGenerator: TokenGenerator
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashCompare = hashCompare;
    this.tokenGenerator = tokenGenerator;
  }

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email
    );

    if (account) {
      const passwordIsValid = await this.hashCompare.compare(
        authentication.password,
        account.password
      );

      if (passwordIsValid) {
        const accessToken = await this.tokenGenerator.generate(account.id);

        return accessToken;
      }
    }

    return null;
  }
}
