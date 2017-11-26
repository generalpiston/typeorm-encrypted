import { expect } from "chai";
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { encrypt, decrypt } from "../src/transformers";
import { ExtendedColumnOptions } from "../src/options";
import { AutoEncryptSubscriber } from "../src/subscribers";
import { withConnection } from "./utils";

@Entity()
class Test extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(<ExtendedColumnOptions>{
    type: "varchar",
    nullable: false,
    encrypt: {
      key: "e41c966f21f9e1577802463f8924e6a3fe3e9751f201304213b2f845d8841d61",
      algorithm: "aes-256-cbc",
      ivLength: 16,
      iv: "ff5ac19190424b1d88f9419ef949ae56"
    }
  })
  secret: string;
}

describe("Entities", () => {
  it ("should encrypt", () => {
    let result = new Test();
    result.secret = "test";
    encrypt(result);
    expect(result.secret).to.equal("/1rBkZBCSx2I+UGe+UmuVhKzmHsDDv0EvRtMBFiaE3A=");
  });

  it ("should decrypt", () => {
    let result = new Test();
    result.secret = "/1rBkZBCSx2I+UGe+UmuVhKzmHsDDv0EvRtMBFiaE3A=";
    decrypt(result);
    expect(result.secret).to.equal("test");
  });

  it ("should automatically encrypt and decrypt", async () => {
    await withConnection([ Test ], [], [ AutoEncryptSubscriber ], async () => {
      let result = new Test();
      result.secret = "test";
      await result.save();
      expect(result.secret).to.equal("/1rBkZBCSx2I+UGe+UmuVhKzmHsDDv0EvRtMBFiaE3A=");

      let results = await Test.find();
      expect(results.length).to.equal(1);
      expect(results[0].secret).to.equal("test");
    });
  })
});
