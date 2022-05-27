import { ValueTransformer, FindOperator, In, Equal, Not } from 'typeorm';
import { EncryptionOptions } from './options';
import { decryptData, encryptData } from './crypto';

export class EncryptionTransformer implements ValueTransformer {
  constructor(private options: EncryptionOptions) {}

  public from(value?: string | null): string | undefined {
    if (!value) {
      return;
    }

    return decryptData(
      Buffer.from(value as string, 'base64'),
      this.options
    ).toString('utf8');
  }

  public to(value?: string | FindOperator<any> | null): string | FindOperator<any> | undefined {
    if ((value ?? null) === null) {
      return;
    }
    if (typeof value === 'string') {
      return encryptData(
        Buffer.from(value as string, 'utf8'),
        this.options
      ).toString('base64');
    }
    if (!value) {
      return;
    }
    // Support FindOperator.
    // Just support "Equal", "In", "Not", and "IsNull".
    // Other operators aren't work correctly, because values are encrypted on the db.
    if (value.type === `in`) {
      return In((value.value as string[]).map(s =>
        encryptData(
          Buffer.from(s, 'utf-8'),
          this.options
        ).toString('base64')
      ));
    } else if (value.type === 'equal') {
      return Equal(encryptData(
        Buffer.from(value.value as string, 'utf-8'),
        this.options
      ).toString('base64'));
    } else if (value.type === 'not') {
      return Not(
        this.to(value.child ?? value.value)
      );
    } else if (value.type === 'isNull') {
      return value
    } else {
      throw new Error('Only "Equal","In", "Not", and "IsNull" are supported for FindOperator');
    }
  }
}

export class JSONEncryptionTransformer implements ValueTransformer {
  constructor(private options: EncryptionOptions) {}

  public from(value?:  null | any): any | undefined {
    if (!value || !value.encrypted) {
      return;
    }

    const decrypted = decryptData(
      Buffer.from(value.encrypted as string, 'base64'),
      this.options
    ).toString('utf8');

    return JSON.parse(decrypted);
  }

  public to(value?: any | FindOperator<any> | null): Object | FindOperator<any> | undefined {
    if ((value ?? null) === null) {
      return;
    }

    if (typeof value === 'object' && !value?.type) {
      const encrypted = encryptData(
        Buffer.from(JSON.stringify(value) as string, 'utf8'),
        this.options
      ).toString('base64');

      return { encrypted }
    }

    if (!value) {
      return;
    }
    
    // FindOperators are not supported.
    throw new Error('Filter operators are not supported for JSON encrypted fields');
  }
}
