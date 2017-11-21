# typeorm-encrypted
Encrypted field for typeorm.

## Installation

```
npm install --save typeorm-encrypted
```

## Example

The following example has the field automatically encrypted/decrypted on save/fetch respectively.

```
@Entity()
export class User extends EncryptedBaseEntity {
  ...
  @EncryptedColumn({
    key: "d85117047fd06d3afa79b6e44ee3a52eb426fc24c3a2e3667732e8da0342b4da",
    algorithm: "aes-256-cbc",
    ivLength: 16
  })
  @Column({
    type: "varchar",
    nullable: false
  })
  secret: string;
  ...
}
```
