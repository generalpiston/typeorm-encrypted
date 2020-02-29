import { ObjectLiteral, getMetadataArgsStorage } from "typeorm";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { ExtendedColumnOptions, EncryptionOptions } from "../options";

/**
 * Encrypt fields on entity.
 */
export function encrypt<T extends ObjectLiteral>(entity: T): T {
  if (!entity) {
    return entity;
  }

  for (let columnMetadata of getMetadataArgsStorage().columns) {
    let { propertyName, mode, target } = columnMetadata;
    let options: ExtendedColumnOptions = columnMetadata.options;
    let encrypt = options.encrypt;
    if (encrypt && mode === "regular" && (encrypt.looseMatching || entity.constructor === target)) {
      if (entity[propertyName]) {
        entity[propertyName] = encryptData(Buffer.from(entity[propertyName], "utf8"), encrypt).toString("base64");
      }
    }
  }
  return entity;
}

/**
 * Encrypt data.
 */
export function encryptData(data: Buffer, options: EncryptionOptions): Buffer {
  let iv = options.iv ? Buffer.from(options.iv, "hex") : randomBytes(options.ivLength);
  let cipher = createCipheriv(options.algorithm, Buffer.from(options.key, "hex"), iv);
  let start = cipher.update(data);
  let final = cipher.final();
  return Buffer.concat([ iv, start, final ]);
}

/**
 * Decrypt fields on entity.
 */
export function decrypt<T extends ObjectLiteral>(entity: T): T {
  if (!entity) {
    return entity;
  }

  for (let columnMetadata of getMetadataArgsStorage().columns) {
    let { propertyName, mode, target } = columnMetadata;
    let options: ExtendedColumnOptions = columnMetadata.options;
    let encrypt = options.encrypt;
    if (encrypt && mode === "regular" && (encrypt.looseMatching || entity.constructor === target)) {
      if (entity[propertyName]) {
        entity[propertyName] = decryptData(Buffer.from(entity[propertyName], "base64"), encrypt).toString("utf8");
      }
    }
  }
  return entity;
}

/**
 * Decrypt data.
 */
export function decryptData(data: Buffer, options: EncryptionOptions): Buffer {
  let iv = data.slice(0, options.ivLength);
  let decipher = createDecipheriv(options.algorithm, Buffer.from(options.key, "hex"), iv);
  let start = decipher.update(data.slice(options.ivLength));
  let final = decipher.final();
  return Buffer.concat([ start, final ]);
}
