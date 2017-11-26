# typeorm-encrypted
Encrypted field for typeorm.

## Installation

```
npm install --save abec/typeorm-encrypted
```

## Example

The following example has the field automatically encrypted/decrypted on save/fetch respectively.

```
import { BaseEntity, Entity, Column, createConnection } from "typeorm";
import { ExtendedColumnOptions, AutoEncryptSubscriber } from "typeorm-encrypted";

@Entity()
class User extends BaseEntity {
  ...

  @Column(<ExtendedColumnOptions>{
    type: "varchar",
    nullable: false,
    encrypt: {
      key: "d85117047fd06d3afa79b6e44ee3a52eb426fc24c3a2e3667732e8da0342b4da",
      algorithm: "aes-256-cbc",
      ivLength: 16,
      iv: "ff5ac19190424b1d88f9419ef949ae56"
    }
  })
  secret: string;

  ...
}

let connection = createConnection({
  ...
  subscribers: [ AutoEncryptSubscriber, ... ]
  ...
});

```
