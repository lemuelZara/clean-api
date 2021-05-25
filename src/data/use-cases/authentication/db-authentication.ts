import {
  Authentication,
  AuthenticationModel
} from '../../../domain/use-cases/authentication';
import { HashCompare } from '../../protocols/crypto/hash-compare';
import { TokenGenerator } from '../../protocols/crypto/token-generator';
import { LoadAccountByEmailRepository } from '../../protocols/database/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '../../protocols/database/update-access-token-repository';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;

  private readonly hashCompare: HashCompare;

  private readonly tokenGenerator: TokenGenerator;

  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository;

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompare: HashCompare,
    tokenGenerator: TokenGenerator,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashCompare = hashCompare;
    this.tokenGenerator = tokenGenerator;
    this.updateAccessTokenRepository = updateAccessTokenRepository;
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

        await this.updateAccessTokenRepository.update(account.id, accessToken);

        return accessToken;
      }
    }

    return null;
  }
}
