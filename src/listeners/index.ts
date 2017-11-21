import { BaseEntity, AfterLoad, BeforeInsert, BeforeUpdate } from "typeorm";

import { encrypt, decrypt } from "../transformers";

export abstract class EncryptedBase {
  @AfterLoad()
  decryptFields(): Promise<this> {
    return Promise.resolve(decrypt(this));
  }

  @BeforeInsert()
  encryptFieldsBeforeInsert(): Promise<this> {
    return Promise.resolve(encrypt(this));
  }

  @BeforeUpdate()
  encryptFieldsBeforeUpdate(): Promise<this> {
    return Promise.resolve(encrypt(this));
  }
}

export abstract class EncryptedBaseEntity extends BaseEntity {
  @AfterLoad()
  decryptFields(): Promise<this> {
    return Promise.resolve(decrypt(this));
  }

  @BeforeInsert()
  encryptFieldsBeforeInsert(): Promise<this> {
    return Promise.resolve(encrypt(this));
  }

  @BeforeUpdate()
  encryptFieldsBeforeUpdate(): Promise<this> {
    return Promise.resolve(encrypt(this));
  }
}
