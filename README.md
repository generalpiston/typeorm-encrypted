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
      algorithm: 'aes-256-gcm',
      ivLength: 16
    })
  })
  secret: string;

  ...
}

```

For JSON fields you can use `JSONEncryptionTransformer`.


```typescript
import { Entity, Column } from "typeorm";
import { EncryptionTransformer } from "typeorm-encrypted";

@Entity()
class User {
  ...

  @Column({
    type: "json",
    nullable: false,
    transformer: new JSONEncryptionTransformer({
      key: 'e41c966f21f9e1577802463f8924e6a3fe3e9751f201304213b2f845d8841d61',
      algorithm: 'aes-256-gcm',
      ivLength: 16
    })
  })
  secret: object;

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
      algorithm: "aes-256-gcm",
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
  algorithm: 'aes-256-gcm',
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

## FAQ

### Why won't complex queries work?

Queries that transform the encrypted column wont work because transformers and subscribers operate outside of the DBMS.

### What alogorithm should I use?

Unless you need to maintain compatibility with an older system (or you know exactly what you're doing),
you should use "aes-256-gcm" for the mode.
This means that the encryption keys are are 256 bits (32-bytes) long and that the mode of operation
is GCM ([Galois Counter Mode](https://en.wikipedia.org/wiki/Galois/Counter_Mode)).

GCM provides both secrecy and authenticity and can generally use CPU acceleration where available.

### Should I hardcode the IV?

No. Don't ever do this.
It will break the encryption and is vulnerable to a "repeated nonce" attack.

If you don't provide an IV, the library will randomly generate a secure one for you.


### Error: Invalid IV length

The most likely reasons you're receiving this error:

1. Column definition is wrong. Probably an issue with the key or IV.
2. There is existing data in your DBMS. In this case, please migrate the data.
3. Your query cache needs to be cleared. The typeorm query cache can be cleared globally using the [typeorm-cli](https://typeorm.io/#/using-cli): `typeorm cache:clear`. For other, more specific, solutions, see the [typeorm documentation](https://typeorm.io/#/caching).

### How can an encrypted column be added to a table with data?

Follow these steps to add an encrypted column.

1. Add a new column (col B) to the table. Configure the column to be encrypted. Remove the transformer from the original column (col A).
2. Write a script that queries all of the entries in the table. Set the value of col B to col A.
3. Save all the records.
4. Rename col A to something else manually.
5. Rename col B to the original name of col A manually.
6. Remove the typeorm configuration for col A.
7. Rename the typeorm configuration for col B to col A's name.
8. Remove col A (unencrypted column) from the table manually.

### Can typeorm-encrypted encrypt the entire database?

No. This library encrypts specific fields in a database.

Popular databases like [MySQL](https://dev.mysql.com/doc/refman/8.0/en/innodb-data-encryption.html) and [PostgreSQL](https://www.postgresql.org/docs/8.1/encryption-options.html) are capable of data-at-rest and in-flight encryption. Refer to your database manual to figure out how to encrypt the entirety of the database.
