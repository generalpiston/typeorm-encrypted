# typeorm-encrypted

Encrypted field for [typeorm](http://typeorm.io).

<div align="center">
  <br />
  <br />
  <a href="https://circleci.com/gh/generalpiston/typeorm-encrypted/tree/master">
    <img src="https://circleci.com/gh/generalpiston/typeorm-encrypted/tree/master.svg?style=shield&circle-token=:circle-token">
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

This library can invoked in 2 ways: transformers or subscribers. In both of the examples below, the `Key` and `IV` vary based on the algorithm. See the [node docs](https://nodejs.org/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options) for more info.

### Transformers (Recommended)

The following example has the field automatically encrypted/decrypted on save/fetch respectively.

```typescript
import { Entity, Column } from "typeorm";
import { EncryptionTransformer } from "typeorm-encrypted";

@Entity()
class User {
  ...

  @Column({
    type: "varchar",
    nullable: false,
    transformer: new EncryptionTransformer({
      key: 'e41c966f21f9e1577802463f8924e6a3fe3e9751f201304213b2f845d8841d61',
      algorithm: 'aes-256-cbc',
      ivLength: 16,
      iv: 'ff5ac19190424b1d88f9419ef949ae56'
    })
  })
  secret: string;

  ...
}

```

More information about transformers is available in the [typeorm docs](https://typeorm.io/#/entities/column-options).

### Subscribers

The following example has the field automatically encrypted/decrypted on save/fetch respectively.

```typescript
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

### How to use a configuration file

The following example is how you can create a config stored in a separate and use it

encryption-config.ts
```typescript
// it is recommended to not store encryption keys directly in config files, 
// it's better to use an environment variable or to use dotenv in order to load the value
export const MyEncryptionTransformerConfig = {
  key: process.env.ENCRYPTION_KEY,
  algorithm: 'aes-256-cbc',
  ivLength: 16
};
```

user.entity.ts
```typescript
import { Entity, Column } from "typeorm";
import { EncryptionTransformer } from "typeorm-encrypted";
import { MyEncryptionTransformerConfig } from './encryption-config.ts'; // path to where you stored your config file

@Entity()
class User {
  // ...

  @Column({
    type: "varchar",
    nullable: false,
    transformer: new EncryptionTransformer(MyEncryptionTransformerConfig)
  })
  secret: string;

  // ...
}
```

It's possible to customize the config if you need to use a different ivLength or customize other fields, a brief example below

`user.entity.ts`
```typescript
class User {
  // same as before, but for the transformer line
  @Column({
    type: "varchar",
    nullable: false,
    transformer: new EncryptionTransformer({...MyEncryptionTransformerConfig, ivLength: 24})
  })
  secret: string;
  // ...
}
```
