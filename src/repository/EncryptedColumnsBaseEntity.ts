
import { BaseEntity } from "typeorm";

import { encrypt, decrypt } from "../transformers";

export class EncryptedColumnBaseEntity extends BaseEntity {
  /**
   * Encrypt fields on entity.
   */
  async encrypt(): Promise<this> {
    return encrypt(this);
  }

  /**
   * Decrypt fields on entity.
   */
  async decrypt(): Promise<this> {
    return decrypt(this);
  }
}
