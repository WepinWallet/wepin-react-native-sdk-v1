"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProviderFactory = void 0;
var _EVMProvider = require("./EVMProvider");
var _reactNative = require("react-native");
var _KaiaProvider = require("./KaiaProvider");
const {
  ProviderRn
} = _reactNative.NativeModules;
class ProviderFactory {
  // 네트워크 ID로 적절한 Provider 인스턴스 생성
  static async createProvider(network) {
    try {
      // 네이티브 모듈에서 Provider 생성 요청
      await ProviderRn.getProvider(network);

      // 네트워크 패밀리에 따라 적절한 Provider 반환
      const networkFamily = await this.getNetworkFamily(network);
      switch (networkFamily) {
        case 'evm':
          return new _EVMProvider.EVMProvider(network);
        case 'kaia':
          return new _KaiaProvider.KaiaProvider(network);
        // 추후 다른 블록체인 지원 시 여기에 추가
        default:
          throw new Error(`Unsupported network family: ${networkFamily}`);
      }
    } catch (error) {
      throw error;
    }
  }

  // 네트워크 ID에 해당하는 패밀리 반환
  static async getNetworkFamily(network) {
    // return networkFamilies[network] || 'evm'; // 기본값은 EVM
    if (network.includes('ethereum') || network.startsWith('evm')) {
      return 'evm';
    } else if (network.includes('klaytn') || network.includes('kaia')) {
      return 'kaia';
    }
    return 'evm';
  }
}
exports.ProviderFactory = ProviderFactory;
//# sourceMappingURL=ProviderFactory.js.map