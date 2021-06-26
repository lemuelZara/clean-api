import jwt from 'jsonwebtoken';

import { Encrypter } from '../../../data/protocols/crypto/encrypter';

export class JWTAdapter implements Encrypter {
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    const accessToken = await jwt.sign({ id: value }, this.secret);

    return accessToken;
  }
}
