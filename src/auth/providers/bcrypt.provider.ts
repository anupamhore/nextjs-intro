import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
  public async hashPassword(data: string | Buffer): Promise<string> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(data, salt);
      return hashedPassword;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to hash password.');
    }
  }

  public async comparePassword(
    data: string | Buffer,
    encrypted: string,
  ): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(data, encrypted);
      return isMatch;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to hash password.');
    }
  }
}
