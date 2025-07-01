"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "WEPIN_OAUTH2", {
  enumerable: true,
  get: function () {
    return _config.WEPIN_OAUTH2;
  }
});
Object.defineProperty(exports, "WEPIN_OAUTH_TOKEN_TYPE", {
  enumerable: true,
  get: function () {
    return _config.WEPIN_OAUTH_TOKEN_TYPE;
  }
});
exports.default = void 0;
var _reactNativeBase = _interopRequireDefault(require("react-native-base64"));
var _wepinProvider = require("./wepinProvider");
var _config = require("./const/config");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// 전역 범위에 atob 및 btoa 함수 정의
global.atob = _reactNativeBase.default.decode;
global.btoa = _reactNativeBase.default.encode;
var _default = exports.default = _wepinProvider.WepinProvider;
//# sourceMappingURL=index.js.map