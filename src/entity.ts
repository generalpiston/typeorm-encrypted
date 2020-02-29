import { ObjectLiteral, getMetadataArgsStorage } from 'typeorm';
import { ExtendedColumnOptions } from './options';
import { decryptData, encryptData } from './crypto';

/**
 * Encrypt fields on entity.
 */
export function encrypt<T extends ObjectLiteral>(entity: any): any {
  if (!entity) {
    return entity;
  }

  for (let columnMetadata of getMetadataArgsStorage().columns) {
    let { propertyName, mode, target } = columnMetadata;
    let options: ExtendedColumnOptions = columnMetadata.options;
    let encrypt = options.encrypt;
    if (
      encrypt &&
      mode === 'regular' &&
      (encrypt.looseMatching || entity.constructor === target)
    ) {
      if (entity[propertyName]) {
        entity[propertyName] = encryptData(
          Buffer.from(entity[propertyName], 'utf8'),
          encrypt
        ).toString('base64');
      }
    }
  }
  return entity;
}

/**
 * Decrypt fields on entity.
 */
export function decrypt<T extends ObjectLiteral>(entity: any): any {
  if (!entity) {
    return entity;
  }

  for (let columnMetadata of getMetadataArgsStorage().columns) {
    let { propertyName, mode, target } = columnMetadata;
    let options: ExtendedColumnOptions = columnMetadata.options;
    let encrypt = options.encrypt;
    if (
      encrypt &&
      mode === 'regular' &&
      (encrypt.looseMatching || entity.constructor === target)
    ) {
      if (entity[propertyName]) {
        entity[propertyName] = decryptData(
          Buffer.from(entity[propertyName], 'base64'),
          encrypt
        ).toString('utf8');
      }
    }
  }
  return entity;
}
