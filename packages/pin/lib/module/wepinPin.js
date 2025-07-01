import { getBundleId } from 'react-native-device-info';
import PackageJson from '../package.json';
import { createWepinPin, initialize, changeLanguage, finalize, generateRegistrationPINBlock, generateAuthPINBlock, generateChangePINBlock, generateAuthOTPCode } from './nativeModule/NativeModuleWepinPin';
import { WepinPinError, WepinPinErrorCode } from './error/WepinError';
import { WepinLogin } from './login/wepinLogin';
import { WEPIN_DEFAULT_CURRENCY, WEPIN_DEFAULT_LANG } from '@wepin/common';
// import type { IWepinUser, providerType } from '@wepin/common';

/**
 * It is entry of Wepin features.
 * Client must use this object to use WepinLogin.
 */
export class WepinPin {
  constructor({
    appId,
    appKey
  }) {
    this._isInitialized = false;
    this.wepinAppId = appId;
    this.wepinAppKey = appKey;
    this.wepinDomain = getBundleId();
    this.version = PackageJson.version;
    createWepinPin(appId, appKey);
    console.log(`Wepin React Native Widget Pin v${this.version} Initialized`);
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
      throw new WepinPinError(WepinPinErrorCode.InvalidAppKey);
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
    await finalize();
    this._isInitialized = false;
  }
  async generateRegistrationPINBlock() {
    return await generateRegistrationPINBlock();
  }
  async generateAuthPINBlock(count) {
    return await generateAuthPINBlock(count);
  }
  async generateChangePINBlock() {
    return await generateChangePINBlock();
  }
  async generateAuthOTPCode() {
    return await generateAuthOTPCode();
  }
  async changeLanguage({
    language
  }) {
    await changeLanguage(language);
  }
}
//# sourceMappingURL=wepinPin.js.map