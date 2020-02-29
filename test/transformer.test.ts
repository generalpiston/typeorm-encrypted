import { expect } from 'chai';
import { Connection } from 'typeorm';
import { withConnection } from './utils';
import TransformerOptionsEntity1 from './entities/TransformerOptionsEntity1';

describe('Transformer', () => {
  it('should automatically encrypt and decrypt', async () => {
    await withConnection(async (connection: Connection) => {
      const manager = connection.manager;
      const repo = connection.getRepository(TransformerOptionsEntity1);
      const instance = await repo.create({ secret: 'test' });
      await repo.save(instance);

      const result = await manager.query(
        'SELECT secret FROM transformer_options_entity1'
      );

      expect(result[0].secret).to.equal(
        '/1rBkZBCSx2I+UGe+UmuVhKzmHsDDv0EvRtMBFiaE3A='
      );

      const results = await repo.find();

      expect(results.length).to.equal(1);
      expect(results[0].secret).to.equal('test');
    });
  });
});
