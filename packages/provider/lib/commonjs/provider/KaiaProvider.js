"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KaiaProvider = void 0;
var _BaseProvider = require("../BaseProvider");
var _reactNative = require("react-native");
var _EVMError = require("../error/EVMError");
// src/providers/EVMProvider.ts

const {
  ProviderRn
} = _reactNative.NativeModules;
/**
 * Kaia 호환 네트워크용 Provider 구현
 */
class KaiaProvider extends _BaseProvider.BaseProvider {
  constructor(network) {
    super();
    this.network = network;

    // 네트워크별 메타데이터 설정
    this.name = `Wepin ${network.charAt(0).toUpperCase() + network.slice(1)}`;
    this.description = `Wepin Provider for ${network}`;
  }

  /**
   * EIP-1193 request 메서드 구현
   */
  async request(args) {
    if (!args || typeof args !== 'object' || Array.isArray(args)) {
      const error = new Error('Invalid request arguments');
      error.code = _EVMError.EthRpcErrorCodes.INVALID_PARAMS; // Invalid params
      throw error;
    }
    const {
      method,
      params
    } = args;
    if (typeof method !== 'string' || method.length === 0) {
      const error = new Error('Invalid request method');
      error.code = _EVMError.EthRpcErrorCodes.INVALID_PARAMS;
      throw error;
    }
    try {
      // 특별 처리가 필요한 메서드들
      if (method === 'eth_requestAccounts' || method === 'eth_accounts' || method === 'klaytn_requestAccounts' || method === 'klaytn_accounts' || method === 'kaia_requestAccounts' || method === 'kaia_accounts') {
        const accounts = await ProviderRn.request(this.network, method, params || []);
        this._handleAccountsChanged(accounts);
        return accounts;
      }
      if (method === 'wallet_switchEthereumChain') {
        const result = await ProviderRn.request(this.network, method, params || []);
        if (result && typeof result === 'object' && 'chainId' in result) {
          this._handleChainChanged({
            chainId: result.chainId
          });
        }
        return result;
      }

      // 일반 요청 처리
      const result = await ProviderRn.request(this.network, method, params || []);
      return result;
    } catch (error) {
      // 3. 네이티브에서 온 에러를 그대로 전달 (이미 표준 형식)
      if (error.code && typeof error.code === 'number') {
        // 네이티브에서 표준 형식으로 온 에러
        throw error;
      }

      // 4. 예상치 못한 에러는 Internal Error로 처리
      const ethError = new Error(`${method} request failed: ${error.message}`);
      ethError.code = _EVMError.EthRpcErrorCodes.INTERNAL_ERROR;
      throw ethError;
    }
  }

  /**
   * 네트워크 정보 반환
   */
  getNetwork() {
    return this.network;
  }
}
exports.KaiaProvider = KaiaProvider;
//# sourceMappingURL=KaiaProvider.js.map