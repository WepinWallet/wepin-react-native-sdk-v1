import { EventEmitter } from 'events';
import type { ProviderInfo } from './types/EIP5749';
import type { RequestArguments } from './types/EIP1193';
/**
 * React Native용 BaseProvider 클래스
 * EventEmitter를 상속하여 Web3 이벤트 지원
 */
export declare abstract class BaseProvider extends EventEmitter implements ProviderInfo {
    uuid: string;
    name: string;
    icon: `data:image/svg+xml;base64,${string}`;
    description: string;
    protected _state: {
        accounts: string[] | null;
        isConnected: boolean;
        initialized: boolean;
        isPermanentlyDisconnected: boolean;
    };
    chainId: string | null;
    selectedAddress: string | null;
    constructor();
    /**
     * EIP-1193 request 메서드
     * Web3 요청 수행
     */
    abstract request<T>(args: RequestArguments): Promise<T>;
    /**
     * 계정 변경 이벤트 처리
     */
    protected _handleAccountsChanged(accounts: unknown[]): void;
    /**
     * 체인 변경 이벤트 처리
     */
    protected _handleChainChanged({ chainId }: {
        chainId?: string;
    }): void;
    /**
     * 연결 이벤트 처리
     */
    protected _handleConnect(chainId: string): void;
    /**
     * 연결 해제 이벤트 처리
     */
    protected _handleDisconnect(isRecoverable: boolean, errorMessage?: string): void;
    /**
     * Provider 초기화
     */
    protected _initializeState(initialState?: {
        accounts: string[];
        chainId: string;
        networkVersion?: string;
    }): void;
    /**
     * 배열 동등성 비교 유틸리티
     */
    private _areArraysEqual;
    /**
     * 연결 상태 확인
     */
    isConnected(): boolean;
}
//# sourceMappingURL=BaseProvider.d.ts.map