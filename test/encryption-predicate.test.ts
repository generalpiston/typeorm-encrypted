import { expect } from "chai";
import { encrypt, decrypt } from "../src/entity";
import { getConnection } from "./utils";
import ColumnOptionsEntity4 from "./entities/ColumnOptionsEntity4";

describe("Column Options - Encryption Predicate", function () {
  this.timeout(10000);

  before(async function () {
    await getConnection();
  });

  it("should encrypt", function () {
    let result = new ColumnOptionsEntity4();
    result.enablePredicate = true;
    result.secret = "test";
    encrypt(result);
    expect(result.secret).to.equal(
      "/1rBkZBCSx2I+UGe+UmuVhKzmHsDDv0EvRtMBFiaE3A="
    );
  });

  it("should not encrypt", function () {
    let result = new ColumnOptionsEntity4();
    result.enablePredicate = false;
    result.secret = "test";
    encrypt(result);
    expect(result.secret).to.equal("test");
  });

  it("should decrypt", function () {
    let result = new ColumnOptionsEntity4();
    result.enablePredicate = true;
    result.secret = "/1rBkZBCSx2I+UGe+UmuVhKzmHsDDv0EvRtMBFiaE3A=";
    decrypt(result);
    expect(result.secret).to.equal("test");
  });

  it("should not decrypt", function () {
    let result = new ColumnOptionsEntity4();
    result.enablePredicate = false;
    result.secret = "test";
    decrypt(result);
    expect(result.secret).to.equal("test");
  });
});
