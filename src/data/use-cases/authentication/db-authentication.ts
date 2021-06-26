import {
  Authentication,
  AuthenticationModel,
  LoadAccountByEmailRepository,
  HashCompare,
  Encrypter,
  UpdateAccessTokenRepository
} from './db-authentication-protocols';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;

  private readonly hashCompare: HashCompare;

  private readonly encrypter: Encrypter;

  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository;

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompare: HashCompare,
    encrypter: Encrypter,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashCompare = hashCompare;
    this.encrypter = encrypter;
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
        const accessToken = await this.encrypter.encrypt(account.id);

        await this.updateAccessTokenRepository.updateAccessToken(
          account.id,
          accessToken
        );

        return accessToken;
      }
    }

    return null;
  }
}
