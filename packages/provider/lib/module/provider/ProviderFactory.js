import { EVMProvider } from './EVMProvider';
import { NativeModules } from 'react-native';
import { KaiaProvider } from './KaiaProvider';
const {
  ProviderRn
} = NativeModules;
export class ProviderFactory {
  // 네트워크 ID로 적절한 Provider 인스턴스 생성
  static async createProvider(network) {
    try {
      // 네이티브 모듈에서 Provider 생성 요청
      await ProviderRn.getProvider(network);

      // 네트워크 패밀리에 따라 적절한 Provider 반환
      const networkFamily = await this.getNetworkFamily(network);
      switch (networkFamily) {
        case 'evm':
          return new EVMProvider(network);
        case 'kaia':
          return new KaiaProvider(network);
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
//# sourceMappingURL=ProviderFactory.js.map