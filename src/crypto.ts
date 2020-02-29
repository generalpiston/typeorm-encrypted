import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { EncryptionOptions } from './options';

/**
 * Encrypt data.
 */
export function encryptData(data: Buffer, options: EncryptionOptions): Buffer {
  let iv = options.iv
    ? Buffer.from(options.iv, 'hex')
    : randomBytes(options.ivLength);
  let cipher = createCipheriv(
    options.algorithm,
    Buffer.from(options.key, 'hex'),
    iv
  );
  let start = cipher.update(data);
  let final = cipher.final();
  return Buffer.concat([iv, start, final]);
}

/**
 * Decrypt data.
 */
export function decryptData(data: Buffer, options: EncryptionOptions): Buffer {
  let iv = data.slice(0, options.ivLength);
  let decipher = createDecipheriv(
    options.algorithm,
    Buffer.from(options.key, 'hex'),
    iv
  );
  let start = decipher.update(data.slice(options.ivLength));
  let final = decipher.final();
  return Buffer.concat([start, final]);
}
