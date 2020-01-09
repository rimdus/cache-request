import { Sha1, Sha256, Sha512 } from 'asmcrypto.js';
import { HashMethod, THash } from '../type/hash.type';
import { murmurHash3 } from '../hash-alg/murmur3';
const sha1 = new Sha1();
const sha256 = new Sha256();
const sha512 = new Sha512();

/**
 * Class provide utils to generate hashes
 */
export class Hash {
  /**
   * Generate hash
   * @param str string
   * @param method hash method
   */
  public static generate(str: string, method: HashMethod = HashMethod.murmur): THash {
    switch (method) {
      case HashMethod.murmur: return Hash.genMurmur(str);
    }
  }

  /**
   * @internal
   * Generate hash sha*
   * @param str String
   * @param method Hash method sha1, sha256 or sha512
   */
  private static genSha(str: string, method: HashMethod): THash {
    let sha;
    switch (method) {
      case HashMethod.sha1:
        sha = sha1;
        break;
      case HashMethod.sha256:
        sha = sha256;
        break;
      case HashMethod.sha512:
        sha = sha512;
        break;
      default:
        throw new Error('Hash.genSha: Unknown hash method.');
    }
    sha.reset();
    const uint8 = Uint8Array.from(Buffer.from(str));
    const result = sha1.process(uint8).finish().result;
    return Buffer.from(result).toString('hex');
  }

  /**
   * @internal
   * @param str
   */
  private static genMurmur(str): THash {
    return murmurHash3(str);
  }
}
