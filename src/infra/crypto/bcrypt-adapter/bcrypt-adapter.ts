import bcrypt from 'bcrypt';
import { HashCompare } from '../../../data/protocols/crypto/hash-compare';

import { Hasher } from '../../../data/protocols/crypto/hasher';

export class BcryptAdapter implements Hasher, HashCompare {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);

    return hash;
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const hashIsValid = await bcrypt.compare(value, hash);

    return hashIsValid;
  }
}
