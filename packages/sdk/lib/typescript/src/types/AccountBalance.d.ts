export interface ITokenBalanceInfo {
    contract: string;
    symbol: string;
    balance: string;
}
export interface IAccountBalanceInfo {
    network: string;
    address: string;
    symbol: string;
    balance: string;
    tokens: ITokenBalanceInfo[];
}
//# sourceMappingURL=AccountBalance.d.ts.map