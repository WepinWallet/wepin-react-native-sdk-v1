import { getBundleId } from 'react-native-device-info';
import PackageJson from '../package.json';
import { createWepinWidget, initialize, loginWithUI, getAccounts, getBalance, getNFTs, send, receive, changeLanguage, getStatus, openWidget, closeWidget, register, finalize } from './nativeModule/NativeModuleWepinSDK';
import { WepinSdkError, WepinSdkErrorCode } from './error/WepinError';
import { WepinLogin } from './login/wepinLogin';
import { WEPIN_DEFAULT_CURRENCY, WEPIN_DEFAULT_LANG } from '@wepin/common';
// import type { IWepinUser, providerType } from '@wepin/common';

/**
 * It is entry of Wepin features.
 * Client must use this object to use WepinLogin.
 */
export class WepinWidgetSDK {
  constructor({
    appId,
    appKey
  }) {
    this._isInitialized = false;
    this.wepinAppId = appId;
    this.wepinAppKey = appKey;
    this.wepinDomain = getBundleId();
    this.version = PackageJson.version;
    createWepinWidget(appId, appKey);
    console.log(`Wepin React Native Widget SDK v${this.version} Initialized`);
  }
  toJSON() {
    return '';
  }

  /**
   * Initialize WepinLogin Object. It returns widget instance.
   */
  async init(attributes = {
    type: 'hide',
    defaultLanguage: WEPIN_DEFAULT_LANG,
    defaultCurrency: WEPIN_DEFAULT_CURRENCY
  }) {
    if (!this.wepinAppId || !this.wepinAppKey) {
      throw new WepinSdkError(WepinSdkErrorCode.InvalidAppKey);
    }
    const result = await initialize(attributes.defaultLanguage ?? WEPIN_DEFAULT_LANG, attributes.defaultCurrency ?? WEPIN_DEFAULT_CURRENCY);
    if (result) {
      this.login = new WepinLogin();
      this._isInitialized = true;
    }
    return this._isInitialized;
  }

  /**
   * Check if wepin is initialized.
   *
   * @returns
   */
  isInitialized() {
    return this._isInitialized;
  }

  /**
   * Finalize Wepin Object.
   */
  async finalize() {
    try {
      await finalize();
    } catch (error) {
      console.log('finalize error', error);
    } finally {
      this._isInitialized = false;
    }
  }
  async loginWithUI(providers, email) {
    return await loginWithUI(providers, email);
  }
  async changeLanguage({
    language,
    currency
  }) {
    await changeLanguage(language, currency);
  }
  async openWidget() {
    return await openWidget();
  }
  async closeWidget() {
    return await closeWidget();
  }
  async register() {
    return await register();
  }
  async getAccounts(options) {
    const accounts = await getAccounts(options === null || options === void 0 ? void 0 : options.networks, options === null || options === void 0 ? void 0 : options.withEoa);
    return accounts;
  }
  async getBalance(accounts) {
    return await getBalance(accounts);
  }
  async getNFTs(options) {
    return await getNFTs((options === null || options === void 0 ? void 0 : options.refresh) ?? false, options === null || options === void 0 ? void 0 : options.networks);
  }
  async send({
    account,
    txData
  }) {
    return await send(account, txData);
  }
  async receive(account) {
    return await receive(account);
  }
  async getStatus() {
    return await getStatus();
  }
}
//# sourceMappingURL=wepinSDK.js.map