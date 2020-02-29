import { expect } from 'chai';
import { Connection } from 'typeorm';
import { withConnection } from './utils';
import ColumnOptionsEntity2 from './entities/ColumnOptionsEntity2';

describe('Column Options - Data Mapper', () => {
  it('should automatically encrypt and decrypt with loose matching', async () => {
    await withConnection(async (connection: Connection) => {
      const repo = connection.getRepository(ColumnOptionsEntity2);
      let result = await repo.save({ looseSecret: 'test' });
      expect(result.looseSecret).to.equal(
        '/1rBkZBCSx2I+UGe+UmuVhKzmHsDDv0EvRtMBFiaE3A='
      );

      let results = await repo.find();
      expect(results.length).to.equal(1);
      expect(results[0].looseSecret).to.equal('test');
    });
  });
});
