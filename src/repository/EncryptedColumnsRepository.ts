
import { Repository, ObjectLiteral } from "typeorm";
import { DeepPartial } from "typeorm/common/DeepPartial";

import { encrypt, decrypt } from "../transformers";

export class EncryptedColumnsRepository<Entity extends ObjectLiteral> extends Repository<Entity> {
  /**
   * Encrypt all fields on entity.
   */
  async encryptAll<T extends DeepPartial<Entity>>(entities: T[]): Promise<T[]> {
    return Promise.all(entities.map((entity: T) => encrypt(entity)));
  }

  /**
   * Encrypt fields on entity.
   */
  async encrypt<T extends DeepPartial<Entity>>(entity: T): Promise<T> {
    return encrypt(entity);
  }

  /**
   * Decrypt all fields on entity.
   */
  async decryptAll<T extends DeepPartial<Entity>>(entities: T[]): Promise<T[]> {
    return Promise.all(entities.map((entity: T) => decrypt(entity)));
  }

  /**
   * Decrypt fields on entity.
   */
  async decrypt<T extends DeepPartial<Entity>>(entity: T): Promise<T> {
    return decrypt(entity);
  }
}
