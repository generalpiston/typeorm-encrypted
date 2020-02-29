import { expect } from 'chai';
import { encrypt, decrypt } from '../src/entity';
import { withConnection } from './utils';
import ColumnOptionsEntity1 from './entities/ColumnOptionsEntity1';

describe('Column Options - Active Record', () => {
  it('should encrypt', () => {
    let result = new ColumnOptionsEntity1();
    result.secret = 'test';
    encrypt(result);
    expect(result.secret).to.equal(
      '/1rBkZBCSx2I+UGe+UmuVhKzmHsDDv0EvRtMBFiaE3A='
    );
  });

  it('should decrypt', () => {
    let result = new ColumnOptionsEntity1();
    result.secret = '/1rBkZBCSx2I+UGe+UmuVhKzmHsDDv0EvRtMBFiaE3A=';
    decrypt(result);
    expect(result.secret).to.equal('test');
  });

  it('should automatically encrypt and decrypt', async () => {
    await withConnection(async () => {
      let result = new ColumnOptionsEntity1();
      result.secret = 'test';
      await result.save();
      expect(result.secret).to.equal(
        '/1rBkZBCSx2I+UGe+UmuVhKzmHsDDv0EvRtMBFiaE3A='
      );

      let results = await ColumnOptionsEntity1.find();
      expect(results.length).to.equal(1);
      expect(results[0].secret).to.equal('test');
    });
  });
});
