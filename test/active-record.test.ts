import { expect } from 'chai';
import { encrypt, decrypt } from '../src/entity';
import { getConnection } from './utils';
import ColumnOptionsEntity1 from './entities/ColumnOptionsEntity1';

describe('Column Options - Active Record', function() {
  this.timeout(10000);

  before(async function () {
    await getConnection();
  })

  it('should encrypt', function() {
    let result = new ColumnOptionsEntity1();
    result.secret = 'test';
    encrypt(result);
    expect(result.secret).to.equal(
      '/1rBkZBCSx2I+UGe+UmuVhKzmHsDDv0EvRtMBFiaE3A='
    );
  });

  it('should decrypt', function() {
    let result = new ColumnOptionsEntity1();
    result.secret = '/1rBkZBCSx2I+UGe+UmuVhKzmHsDDv0EvRtMBFiaE3A=';
    decrypt(result);
    expect(result.secret).to.equal('test');
  });

  it('should automatically encrypt and decrypt', async function() {
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
