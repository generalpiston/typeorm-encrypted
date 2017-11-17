
import { ObjectLiteral } from "typeorm";

import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

import  { getMetadataStorage } from "../metadata";

/**
 * Encrypt fields on entity.
 */
export function encrypt<T extends ObjectLiteral>(entity: T): T {
  for (let columnMetadata of getMetadataStorage().encryptedColumns) {
    if (entity.constructor === columnMetadata.target) {
      for (let prop in entity) {
        if (prop === columnMetadata.propertyName) {
          let contents = entity[prop];
          let iv: Buffer = randomBytes(columnMetadata.options.ivLength);
          let cipher = createCipheriv(columnMetadata.options.algorithm, Buffer.from(columnMetadata.options.key, "hex"), iv);
          let encryptedStart = cipher.update(contents, "utf8");
          let encryptedFinal = cipher.final();
          let encrypted = Buffer.concat([ iv, encryptedStart, encryptedFinal ]);
          entity[prop] = encrypted.toString("base64");
        }
      }
    }
  }
  return entity;
}

/**
 * Decrypt fields on entity.
 */
export function decrypt<T extends ObjectLiteral>(entity: T): T {
  for (let columnMetadata of getMetadataStorage().encryptedColumns) {
    if (entity.constructor === columnMetadata.target) {
      for (let prop in entity) {
        if (prop === columnMetadata.propertyName) {
          let contents = entity[prop];
          let buffer = Buffer.from(contents, "base64");
          let iv = buffer.slice(0, columnMetadata.options.ivLength);
          let decipher = createDecipheriv(columnMetadata.options.algorithm, Buffer.from(columnMetadata.options.key, "hex"), iv);
          let decryptedStart = decipher.update(buffer.slice(columnMetadata.options.ivLength), null, "utf8");
          let decryptedFinal = decipher.final("utf8");
          let decrypted = decryptedStart + decryptedFinal;
          entity[prop] = decrypted;
        }
      }
    }
  }
  return entity;
}
