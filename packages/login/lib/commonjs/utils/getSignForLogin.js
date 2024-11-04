"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSignForLogin = getSignForLogin;
var _secp256k = _interopRequireDefault(require("secp256k1"));
var _sha = _interopRequireDefault(require("sha256"));
var _buffer = require("buffer");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function getSignForLogin(privKey, msg) {
  const key = _buffer.Buffer.from(privKey, 'hex');
  const hash = (0, _sha.default)(msg);
  const message = _buffer.Buffer.from(hash, 'hex');
  const sigObj = _secp256k.default.ecdsaSign(message, key);
  return _buffer.Buffer.from(sigObj.signature).toString('hex');
}
//# sourceMappingURL=getSignForLogin.js.map