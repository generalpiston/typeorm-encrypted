import { expect } from "chai";
import { Column } from "typeorm";
import { EncryptedColumn } from "../src/decorators";
import { encrypt, decrypt } from "../src/transformers";

class Test {
  @EncryptedColumn({
    key: "e41c966f21f9e1577802463f8924e6a3fe3e9751f201304213b2f845d8841d61",
    algorithm: "aes-256-cbc",
    ivLength: 16,
    iv: "ff5ac19190424b1d88f9419ef949ae56"
  })
  @Column({
    type: "varchar",
    nullable: false
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
});
