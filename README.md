
# typeorm-encrypted

Encrypted field for [typeorm](http://typeorm.io).

<div align="center">
  <br />
  <br />
  <a href="https://circleci.com/gh/abec/typeorm-encrypted/tree/master">
    <img src="https://circleci.com/gh/abec/typeorm-encrypted/tree/master.svg?style=shield&circle-token=:circle-token">
  </a>
  <a href="https://badge.fury.io/js/typeorm-encrypted">
    <img src="https://badge.fury.io/js/typeorm-encrypted.svg">
  </a>
  <a href="https://david-dm.org/abec/typeorm-encrypted">
    <img src="https://david-dm.org/abec/typeorm-encrypted.svg">
  </a>
  <br />
  <br />
</div>

## Installation

```
npm install --save typeorm-encrypted
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
      ivLength: 16
    }
  })
  secret: string;

  ...
}

let connection = createConnection({
  ...
  entities: [ User, ... ],
  subscribers: [ AutoEncryptSubscriber, ... ]
  ...
});

```

Entities and subscribers can be configured via `ormconfig.json` and environment variables as well. See the [typeorm docs](http://typeorm.io/#/using-ormconfig) for more details.
