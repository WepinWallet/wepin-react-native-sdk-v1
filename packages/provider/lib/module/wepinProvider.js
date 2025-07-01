import { getBundleId } from 'react-native-device-info';
import PackageJson from '../package.json';
// import type {
//   LoginOauthResult,
//   LoginResult,
//   ILoginAccessTokenParams,
//   ILoginIdTokenParams,
//   ILoginOauth2Params,
// } from './types';
import { createWepinProvider, initialize, changeLanguage, finalize } from './nativeModule/NativeModuleWepinProvider';
import { WepinProviderError, WepinProviderErrorCode } from './error/WepinError';
import { WepinLogin } from './login/wepinLogin';
import { WEPIN_DEFAULT_CURRENCY, WEPIN_DEFAULT_LANG } from '@wepin/common';
// import { ProviderFactory } from './provider/ProviderFactory';

import { UniversalProvider } from './provider/UniversalProvider';
// import type { IWepinUser, providerType } from '@wepin/common';

/**
 * It is entry of Wepin features.
 * Client must use this object to use WepinLogin.
 */
export class WepinProvider {
  constructor({
    appId,
    appKey
  }) {
    this._isInitialized = false;
    this.wepinAppId = appId;
    this.wepinAppKey = appKey;
    this.wepinDomain = getBundleId();
    this.version = PackageJson.version;
    this.appEmailVerified = true;
    createWepinProvider(appId, appKey);
    console.log(`Wepin React Native Provider SDK v${this.version} Initialized`);
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
      throw new WepinProviderError(WepinProviderErrorCode.InvalidAppKey);
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
  async changeLanguage({
    language,
    currency
  }) {
    await changeLanguage(language, currency);
  }
  async getProvider(network) {
    if (!this._isInitialized) {
      throw new WepinProviderError(WepinProviderErrorCode.NotInitialized);
    }
    try {
      // UniversalProvider 생성 및 초기화
      const provider = new UniversalProvider(network);
      await provider.initialize(); // 내부에서 ProviderRn.getProvider 호출

      return provider;
    } catch (error) {
      console.error(`WepinProvider.getProvider error:`, error);
      throw error;
    }
  }

  /**
   * Finalize Wepin Object.
   */
  async finalize() {
    await finalize();
    this._isInitialized = false;
  }
}
//# sourceMappingURL=wepinProvider.js.map