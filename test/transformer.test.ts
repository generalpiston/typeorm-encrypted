import { expect } from 'chai';
import { Connection } from 'typeorm';
import { withConnection } from './utils';
import TransformerOptionsEntity1 from './entities/TransformerOptionsEntity1';
import TransformerOptionsAES256GCMEntity1 from './entities/TransformerOptionsAES256GCMEntity1';
import TransformerOptionsAES256GCMEntity2 from './entities/TransformerOptionsAES256GCMEntity2';

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

  it('should automatically encrypt and decrypt aes-256-gcm', async () => {
    await withConnection(async (connection: Connection) => {
      const manager = connection.manager;
      const repo = connection.getRepository(TransformerOptionsAES256GCMEntity1);
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

  it('should automatically encrypt and decrypt aes-256-ccm with 8-byte long auth tag length', async () => {
    await withConnection(async (connection: Connection) => {
      const manager = connection.manager;
      const repo = connection.getRepository(TransformerOptionsAES256GCMEntity2);
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
