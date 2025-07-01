import type { IAccount } from './Account';
export interface INFTContract {
    name: string;
    address: string;
    scheme: string;
    description?: string;
    network: string;
    externalLink?: string;
    imageUrl?: string;
}
export interface INFT {
    account: IAccount;
    contract: INFTContract;
    name: string;
    imageUrl: string;
    contentUrl?: string;
    contentType: string;
    quantity?: number;
    externalLink: string;
    description: string;
    state: number;
}
//# sourceMappingURL=NFT.d.ts.map