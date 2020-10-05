import { expect } from 'chai';
import { Connection } from 'typeorm';
import { withConnection } from './utils';
import TransformerOptionsEntityEmptyString1 from './entities/TransformerOptionsEntityEmptyString1';
import TransformerOptionsEntity1 from './entities/TransformerOptionsEntity1';
import TransformerOptionsEntityNullable1 from './entities/TransformerOptionsEntityNullable1';
import TransformerOptionsEntityNullable2 from './entities/TransformerOptionsEntityNullable2';
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

  it('should automatically encrypt and decrypt aes-256-gcm with 8-byte long auth tag length', (done) => {
    withConnection(async (connection: Connection) => {
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

      done();
    });
  });

  it('should not encrypt / decrypt null values', (done) => {
    withConnection(async (connection: Connection) => {
      const manager = connection.manager;
      const repo = connection.getRepository(TransformerOptionsEntityNullable1);
      const instance = await repo.create({ secret: null });
      await repo.save(instance);

      const result = await manager.query(
        'SELECT secret FROM transformer_options_entity_nullable1'
      );
      

      expect(result[0].secret).to.equal(
        null
      );

      const results = await repo.find();

      expect(results.length).to.equal(1);
      expect(results[0].secret).to.equal(undefined);

      done()
    });
  });

  it('should not encrypt / decrypt undefined values', (done) => {
    withConnection(async (connection: Connection) => {
      const manager = connection.manager;
      const repo = connection.getRepository(TransformerOptionsEntityNullable2);
      const instance = await repo.create({ secret: undefined });
      await repo.save(instance);

      const result = await manager.query(
        'SELECT secret FROM transformer_options_entity_nullable2'
      );
      

      expect(result[0].secret).to.equal(
        null
      );

      const results = await repo.find();

      expect(results.length).to.equal(1);
      expect(results[0].secret).to.equal(undefined);

      done()
    });
  });

  it('should encrypt / decrypt empty strings', (done) => {
    withConnection(async (connection: Connection) => {
      const manager = connection.manager;
      const repo = connection.getRepository(TransformerOptionsEntityEmptyString1);
      const instance = await repo.create({ secret: '' });
      await repo.save(instance);

      const result = await manager.query(
        'SELECT secret FROM transformer_options_entity_empty_string1'
      );
      

      expect(result[0].secret).to.equal(
        '/1rBkZBCSx2I+UGe+UmuVvnjveB6onZ3uoKZCOZfzbk='
      );

      const results = await repo.find();

      expect(results.length).to.equal(1);
      expect(results[0].secret).to.equal('');

      done()
    });
  });
});
