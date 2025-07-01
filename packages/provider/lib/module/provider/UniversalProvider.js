// src/provider/UniversalProvider.ts
import { BaseProvider } from '../BaseProvider';
import { NativeModules } from 'react-native';
import { EthRpcErrorCodes } from '../error/EVMError';
const {
  ProviderRn
} = NativeModules;
/**
 * 모든 네트워크를 지원하는 통합 Provider
 * Android SDK에서 네트워크별 처리를 담당
 */
export class UniversalProvider extends BaseProvider {
  constructor(network) {
    super();
    this.network = network;

    // 네트워크별 메타데이터 설정
    this.name = `Wepin ${network.charAt(0).toUpperCase() + network.slice(1)}`;
    this.description = `Wepin Provider for ${network}`;
  }

  /**
   * Provider 초기화 (네트워크 준비)
   * Android SDK에 해당 네트워크 Provider 준비 요청
   */
  async initialize() {
    try {
      await ProviderRn.getProvider(this.network);
    } catch (error) {
      throw new Error(`Failed to initialize provider for network ${this.network}: ${error}`);
    }
  }

  /**
   * EIP-1193 request 메서드 구현
   * Android SDK에서 모든 네트워크 처리를 담당
   */
  async request(args) {
    if (!args || typeof args !== 'object' || Array.isArray(args)) {
      const error = new Error('Invalid request arguments');
      error.code = EthRpcErrorCodes.INVALID_PARAMS;
      throw error;
    }
    const {
      method,
      params
    } = args;
    if (typeof method !== 'string' || method.length === 0) {
      const error = new Error('Invalid request method');
      error.code = EthRpcErrorCodes.INVALID_PARAMS;
      throw error;
    }
    try {
      // 계정 관련 메서드들의 이벤트 처리
      if (this._isAccountMethod(method)) {
        const accounts = await ProviderRn.request(this.network, method, params || []);
        this._handleAccountsChanged(accounts);
        return accounts;
      }

      // 체인 변경 메서드의 이벤트 처리  
      if (method === 'wallet_switchEthereumChain') {
        const result = await ProviderRn.request(this.network, method, params || []);
        if (result && typeof result === 'object' && 'chainId' in result) {
          this._handleChainChanged({
            chainId: result.chainId
          });
        }
        return result;
      }

      // 일반 요청 처리 - Android SDK에서 네트워크별 로직 처리
      const result = await ProviderRn.request(this.network, method, params || []);
      return result;
    } catch (error) {
      // Android SDK에서 표준화된 에러 전달
      if (error.code && typeof error.code === 'number') {
        throw error;
      }

      // 예상치 못한 에러 처리
      const ethError = new Error(`${method} request failed: ${error.message}`);
      ethError.code = EthRpcErrorCodes.INTERNAL_ERROR;
      throw ethError;
    }
  }

  /**
   * 계정 관련 메서드 판단
   */
  _isAccountMethod(method) {
    const accountMethods = ['eth_requestAccounts', 'eth_accounts', 'klaytn_requestAccounts', 'klaytn_accounts', 'kaia_requestAccounts', 'kaia_accounts'];
    return accountMethods.includes(method);
  }

  /**
   * 네트워크 정보 반환
   */
  getNetwork() {
    return this.network;
  }

  /**
   * 현재 chainId 조회 (Native에서 실시간 조회)
   */
  async getCurrentChainId() {
    try {
      const result = await ProviderRn.request(this.network, 'eth_chainId', []);
      return result;
    } catch (error) {
      console.warn('Failed to get chainId:', error);
      return null;
    }
  }

  /**
   * 현재 accounts 조회 (Native에서 실시간 조회)
   */
  async getCurrentAccounts() {
    try {
      const result = await ProviderRn.request(this.network, 'eth_accounts', []);
      return result;
    } catch (error) {
      console.warn('Failed to get accounts:', error);
      return [];
    }
  }
}
//# sourceMappingURL=UniversalProvider.js.map