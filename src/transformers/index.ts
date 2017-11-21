
import { ObjectLiteral } from "typeorm";

// import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { createCipheriv, createDecipheriv } from "crypto";

import  { getMetadataStorage } from "../metadata";
import { IEncryptedColumnOptions } from "../decorators/options";

/**
 * Encrypt fields on entity.
 */
export function encrypt<T extends ObjectLiteral>(entity: T): T {
  for (let columnMetadata of getMetadataStorage().encryptedColumns) {
    if (entity.constructor === columnMetadata.target) {
      for (let prop in entity) {
        if (prop === columnMetadata.propertyName) {
          entity[prop] = encryptData(Buffer.from(entity[prop], "utf8"), columnMetadata.options).toString("base64");
        }
      }
    }
  }
  return entity;
}

/**
 * Encrypt data.
 */
export function encryptData(data: Buffer, options: IEncryptedColumnOptions): Buffer {
  let iv = data.slice(0, options.ivLength);
  let cipher = createCipheriv(options.algorithm, Buffer.from(options.key, "hex"), iv);
  let start = cipher.update(data.slice(options.ivLength));
  let final = cipher.final();
  return Buffer.concat([ start, final ]);
}

/**
 * Decrypt fields on entity.
 */
export function decrypt<T extends ObjectLiteral>(entity: T): T {
  for (let columnMetadata of getMetadataStorage().encryptedColumns) {
    if (entity.constructor === columnMetadata.target) {
      for (let prop in entity) {
        if (prop === columnMetadata.propertyName) {
          entity[prop] = decryptData(Buffer.from(entity[prop], "base64"), columnMetadata.options).toString("utf8");
        }
      }
    }
  }
  return entity;
}

/**
 * Decrypt data.
 */
export function decryptData(data: Buffer, options: IEncryptedColumnOptions): Buffer {
  let iv = data.slice(0, options.ivLength);
  let decipher = createDecipheriv(options.algorithm, Buffer.from(options.key, "hex"), iv);
  let start = decipher.update(data.slice(options.ivLength));
  let final = decipher.final();
  return Buffer.concat([ start, final ]);
}
