import { expect } from 'chai';
import { encryptData, decryptData } from '../src/crypto';

describe('Crypto', () => {
  it('should encrypt', () => {
    let result = encryptData(Buffer.from('test', 'utf8'), {
      key: 'e41c966f21f9e1577802463f8924e6a3fe3e9751f201304213b2f845d8841d61',
      algorithm: 'aes-256-cbc',
      ivLength: 16,
      iv: 'ff5ac19190424b1d88f9419ef949ae56'
    });
    expect(result.toString('base64')).to.equal(
      '/1rBkZBCSx2I+UGe+UmuVhKzmHsDDv0EvRtMBFiaE3A='
    );
  });

  it('should decrypt', () => {
    let result = decryptData(
      Buffer.from('/1rBkZBCSx2I+UGe+UmuVhKzmHsDDv0EvRtMBFiaE3A=', 'base64'),
      {
        key: 'e41c966f21f9e1577802463f8924e6a3fe3e9751f201304213b2f845d8841d61',
        algorithm: 'aes-256-cbc',
        ivLength: 16
      }
    );
    expect(result.toString('utf8')).to.equal('test');
  });
});
