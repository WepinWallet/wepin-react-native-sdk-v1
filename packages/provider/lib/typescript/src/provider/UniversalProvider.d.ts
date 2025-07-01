import { BaseProvider } from '../BaseProvider';
import type { RequestArguments } from '../types/EIP1193';
/**
 * 모든 네트워크를 지원하는 통합 Provider
 * Android SDK에서 네트워크별 처리를 담당
 */
export declare class UniversalProvider extends BaseProvider {
    private network;
    constructor(network: string);
    /**
     * Provider 초기화 (네트워크 준비)
     * Android SDK에 해당 네트워크 Provider 준비 요청
     */
    initialize(): Promise<void>;
    /**
     * EIP-1193 request 메서드 구현
     * Android SDK에서 모든 네트워크 처리를 담당
     */
    request<T>(args: RequestArguments): Promise<T>;
    /**
     * 계정 관련 메서드 판단
     */
    private _isAccountMethod;
    /**
     * 네트워크 정보 반환
     */
    getNetwork(): string;
    /**
     * 현재 chainId 조회 (Native에서 실시간 조회)
     */
    getCurrentChainId(): Promise<string | null>;
    /**
     * 현재 accounts 조회 (Native에서 실시간 조회)
     */
    getCurrentAccounts(): Promise<string[]>;
}
//# sourceMappingURL=UniversalProvider.d.ts.map