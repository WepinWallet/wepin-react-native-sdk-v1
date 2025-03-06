"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WepinStorageManager = void 0;
var _storageRn = _interopRequireDefault(require("@wepin/storage-rn"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class WepinStorageManager {
  constructor(platform, appId) {
    this.appId = appId;
    this.platform = platform;
    this.wepinStorage = new _storageRn.default(this.appId);
  }
  async setAllLocalStorage(value) {
    await this.wepinStorage.setAllLocalStorage(this.appId, value);
  }
  async setLocalStorage(name, value) {
    await this.wepinStorage.setLocalStorage(this.appId, name, value);
  }
  async getLocalStorage(name) {
    return this.wepinStorage.getLocalStorage(this.appId, name);
  }
  async getAllLocalStorage() {
    return this.wepinStorage.getAllLocalStorage(this.appId);
  }
  async clearLocalStorage(name) {
    await this.wepinStorage.clearLocalStorage(this.appId, name);
  }
  async clearAllLocalStorage(onlyAppId) {
    if (onlyAppId) {
      await this.wepinStorage.clearAllLocalStorage(this.appId);
    } else {
      await this.wepinStorage.clearAllLocalStorage(this.appId);
    }
  }
  async setLoginUserLocalStorage(request, response) {
    return await this.wepinStorage.setLoginUserLocalStorage(this.appId, request, response);
  }
}
exports.WepinStorageManager = WepinStorageManager;
//# sourceMappingURL=WepinStorageManager.js.map