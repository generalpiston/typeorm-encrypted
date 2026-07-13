import { expect } from "chai";
import { DataSource, In, Not, IsNull, Equal, LessThan, Like } from "typeorm";
import { getConnection } from "./utils";
import TransformerOptionsEntity3 from "./entities/TransformerOptionsEntity3";
import { EncryptionTransformer } from "../src/transformer";

describe("Find operator", function () {
  let connection: DataSource;

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
          secret: In([secret1, secret2]),
        },
      });
      expect(whereIn.length).to.equal(2);
      expect(whereIn[0].secret).to.equal(secret1);
      expect(whereIn[1].secret).to.equal(secret2);
      // Where not
      const whereNot = await repo.find({
        where: {
          secret: Not(secret2),
        },
      });
      expect(whereNot.length).to.equal(1);
      expect(whereNot[0].secret).to.equal(secret1);
      // Where equal
      const whereEqual = await repo.find({
        where: {
          secret: Equal(secret1),
        },
      });
      expect(whereEqual.length).to.equal(1);
      expect(whereEqual[0].secret).to.equal(secret1);
      // Where not in
      const whereNotIn = await repo.find({
        where: {
          secret: Not(In([secret2])),
        },
      });
      expect(whereNotIn.length).to.equal(1);
      expect(whereNotIn[0].secret).to.equal(secret1);
      // Where IsNull
      const whereIsNull = await repo.find({
        where: {
          secret: IsNull(),
        },
      });
      expect(whereIsNull.length).to.equal(0);
    } finally {
      await repo.clear();
    }
  });
  it("should not match wildcard Like patterns on encrypted values", async function () {
    const repo = connection.getRepository(TransformerOptionsEntity3);

    try {
      const secret1 = "test3";
      await repo.save({ secret: secret1 });

      const whereLike = await repo.find({
        where: {
          secret: Like(`%${secret1}%`),
        },
      });

      expect(whereLike.length).to.equal(0);
    } finally {
      await repo.clear();
    }
  });

  it("should reject unsupported FindOperator instances when transformed directly", function () {
    const transformer = new EncryptionTransformer({
      key: 'e41c966f21f9e1577802463f8924e6a3fe3e9751f201304213b2f845d8841d61',
      algorithm: 'aes-256-cbc',
      ivLength: 16,
      iv: 'ff5ac19190424b1d88f9419ef949ae56'
    });

    expect(() => transformer.to(Like("%test3%"))).to.throw('Only "Equal","In", "Not", and "IsNull" are supported for FindOperator');
    expect(() => transformer.to(LessThan("test3"))).to.throw('Only "Equal","In", "Not", and "IsNull" are supported for FindOperator');
  });
});
