import { ValueTransformer } from 'typeorm';
import { EncryptionOptions } from './options';
import { decryptData, encryptData } from './crypto';

export class EncryptionTransformer implements ValueTransformer {
  constructor(private options: EncryptionOptions) {}

  public from(value?: string | null): string | undefined {
    if (value === null || value === undefined) {
      return;
    }

    return decryptData(
      Buffer.from(value as string, 'base64'),
      this.options
    ).toString('utf8');
  }

  public to(value?: string | null): string | undefined {
    if (value === null || value === undefined) {
      return;
    }

    return encryptData(
      Buffer.from(value as string, 'utf8'),
      this.options
    ).toString('base64');
  }
}
