import WepinRNStorage from '@wepin/storage-rn';
export class WepinStorageManager {
  constructor(platform, appId) {
    this.appId = appId;
    this.platform = platform;
    this.wepinStorage = new WepinRNStorage();
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
      await this.wepinStorage.clearAllAppIdsData();
    }
  }
  async setLoginUserLocalStorage(request, response) {
    return await this.wepinStorage.setLoginUserLocalStorage(this.appId, request, response);
  }
}
//# sourceMappingURL=WepinStorageManager.js.map