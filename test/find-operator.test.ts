import { expect } from "chai";
import { Connection, In, Not, IsNull, Equal, Like, LessThan } from "typeorm";
import { getConnection } from "./utils";
import TransformerOptionsEntity3 from "./entities/TransformerOptionsEntity3";

describe("Column Options - Data Mapper", function () {
  let connection: Connection;

  this.timeout(10000);

  before(async function () {
    connection = await getConnection();
  });
  it("should find by supported FindOperator", async function () {
    const repo = connection.getRepository(TransformerOptionsEntity3);

    try {
      const secret1 = "test1";
      const secret2 = "test2";
      await repo.save([{ secret: secret1 }, { secret: secret2 }]);
      // Where in
      const whereIn = await repo.find({
        where: {
          secret: In([secret1, secret2])
        }
      });
      expect(whereIn.length).to.equal(2);
      expect(whereIn[0].secret).to.equal(secret1);
      expect(whereIn[1].secret).to.equal(secret2);
      // Where not
      const whereNot = await repo.find({
        where: {
          secret: Not(secret2)
        }
      });
      expect(whereNot.length).to.equal(1);
      expect(whereNot[0].secret).to.equal(secret1);
      // Where equal
      const whereEqual = await repo.find({
        where: {
          secret: Equal(secret1)
        }
      });
      expect(whereEqual.length).to.equal(1);
      expect(whereEqual[0].secret).to.equal(secret1);
      // Where not in
      const whereNotIn = await repo.find({
        where: {
          secret: Not(In([secret2]))
        }
      });
      expect(whereNotIn.length).to.equal(1);
      expect(whereNotIn[0].secret).to.equal(secret1);
      // Where IsNull
      const whereIsNull = await repo.find({
        where: {
          secret: IsNull()
        }
      });
      expect(whereIsNull.length).to.equal(0);
    } finally {
      await repo.clear();
    }
  });
  it("should throw error by not supported FindOperator", async function () {
    const repo = connection.getRepository(TransformerOptionsEntity3);

    try {
      const secret1 = "test3";
      const secret2 = "test4";
      await repo.save([{ secret: secret1 }, { secret: secret2 }]);
      // Can't use FindOperator except supported ones
      for (const notSupportedOperator of [
        LessThan(secret1),
        Like(secret1)]) {
          await repo.find({
            where: {
              secret: notSupportedOperator
            }
          }).then( () => {
            throw new Error("Never resolved")
          }, (reason) => {
            expect(reason.message).to.equal(
              'Only "Equal","In", "Not", and "IsNull" are supported for FindOperator'
            )
          });
      }
    } finally {
      await repo.clear();
    }
  });
});
