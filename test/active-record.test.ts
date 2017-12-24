import { expect } from "chai";
import { encrypt, decrypt } from "../src/transformers";
import { withConnection } from "./utils";
import Test1 from "./entities/Test1";

describe("Entities", () => {
  it ("should encrypt", () => {
    let result = new Test1();
    result.secret = "test";
    encrypt(result);
    expect(result.secret).to.equal("/1rBkZBCSx2I+UGe+UmuVhKzmHsDDv0EvRtMBFiaE3A=");
  });

  it ("should decrypt", () => {
    let result = new Test1();
    result.secret = "/1rBkZBCSx2I+UGe+UmuVhKzmHsDDv0EvRtMBFiaE3A=";
    decrypt(result);
    expect(result.secret).to.equal("test");
  });

  it ("should automatically encrypt and decrypt", async () => {
    await withConnection(async () => {
      let result = new Test1();
      result.secret = "test";
      await result.save();
      expect(result.secret).to.equal("/1rBkZBCSx2I+UGe+UmuVhKzmHsDDv0EvRtMBFiaE3A=");

      let results = await Test1.find();
      expect(results.length).to.equal(1);
      expect(results[0].secret).to.equal("test");
    });
  });
});
