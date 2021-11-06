import { expect } from "chai";
import { Connection, In } from "typeorm";
import { getConnection } from "./utils";
import ColumnOptionsEntity2 from "./entities/ColumnOptionsEntity2";
import ColumnOptionsEntity4 from "./entities/ColumnOptionsEntity4";

describe("Column Options - Data Mapper", function () {
  let connection: Connection;

  this.timeout(10000);

  before(async function () {
    connection = await getConnection();
  });

  it("should automatically encrypt and decrypt with loose matching", async function () {
    const repo = connection.getRepository(ColumnOptionsEntity2);

    try {
      let result = await repo.save({ looseSecret: "test" });
      expect(result.looseSecret).to.equal("/1rBkZBCSx2I+UGe+UmuVhKzmHsDDv0EvRtMBFiaE3A=");

      let results = await repo.find();
      expect(results.length).to.equal(1);
      expect(results[0].looseSecret).to.equal("test");
    } finally {
      await repo.clear();
    }
  });
  it("should find by Where In clause", async function () {
    const repo = connection.getRepository(ColumnOptionsEntity4);

    try {
      const secret = "test1"
      await repo.save({ secret });

      const fromDb = await repo.find({
        where: {
          secret: In([secret])
        }
      })
      expect(fromDb.length).to.equal(1)

    } finally {
      await repo.clear()
    }
  })
});
