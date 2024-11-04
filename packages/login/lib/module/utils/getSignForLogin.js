import secp256k1 from 'secp256k1';
import sha256 from 'sha256';
import { Buffer } from 'buffer';
export function getSignForLogin(privKey, msg) {
  const key = Buffer.from(privKey, 'hex');
  const hash = sha256(msg);
  const message = Buffer.from(hash, 'hex');
  const sigObj = secp256k1.ecdsaSign(message, key);
  return Buffer.from(sigObj.signature).toString('hex');
}
//# sourceMappingURL=getSignForLogin.js.map