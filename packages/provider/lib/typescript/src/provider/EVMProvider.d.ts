import { BaseProvider } from '../BaseProvider';
import type { RequestArguments } from '../types/EIP1193';
/**
 * EVM 호환 네트워크용 Provider 구현
 */
export declare class EVMProvider extends BaseProvider {
    private network;
    constructor(network: string);
    /**
     * EIP-1193 request 메서드 구현
     */
    request<T>(args: RequestArguments): Promise<T>;
    /**
     * 네트워크 정보 반환
     */
    getNetwork(): string;
}
//# sourceMappingURL=EVMProvider.d.ts.map