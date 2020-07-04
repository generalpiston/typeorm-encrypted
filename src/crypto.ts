import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { EncryptionOptions } from './options';

const DEFAULT_AUTH_TAG_LENGTH = 16;

function hasAuthTag(algorithm: string):boolean {
  return algorithm.endsWith('-gcm') || algorithm.endsWith('-ccm') || algorithm.endsWith('-ocb')
}

/**
 * Encrypt data.
 */
export function encryptData(data: Buffer, options: EncryptionOptions): Buffer {
  const { algorithm, authTagLength, ivLength, key } = options;
  const iv = options.iv
    ? Buffer.from(options.iv, 'hex')
    : randomBytes(ivLength);
  const cipherOptions = { authTagLength: authTagLength ?? DEFAULT_AUTH_TAG_LENGTH };
  const cipher = (createCipheriv as any)(
    algorithm,
    Buffer.from(key, 'hex'),
    iv,
    cipherOptions
  );
  const start = cipher.update(data);
  const final = cipher.final();

  if (hasAuthTag(options.algorithm)) {
    return Buffer.concat([iv, cipher.getAuthTag(), start, final]);
  } else {
    return Buffer.concat([iv, start, final]);
  }
}

/**
 * Decrypt data.
 */
export function decryptData(data: Buffer, options: EncryptionOptions): Buffer {
  const { algorithm, ivLength, key } = options;
  const authTagLength = options.authTagLength ?? DEFAULT_AUTH_TAG_LENGTH;
  const iv = data.slice(0, ivLength);
  const decipher = createDecipheriv(
    algorithm,
    Buffer.from(key, 'hex'),
    iv
  );

  let dataToUse = data.slice(options.ivLength);

  if (hasAuthTag(options.algorithm)) {
    decipher.setAuthTag(dataToUse.slice(0, authTagLength));
    dataToUse = dataToUse.slice(authTagLength);
  }

  const start = decipher.update(dataToUse);
  const final = decipher.final();

  return Buffer.concat([start, final]);
}
