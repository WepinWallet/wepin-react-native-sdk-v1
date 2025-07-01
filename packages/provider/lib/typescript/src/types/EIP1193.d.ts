export interface RequestArguments {
    readonly id?: number;
    readonly method: string;
    readonly params?: readonly unknown[] | object;
}
export interface IProvider {
    request(args: RequestArguments): Promise<unknown>;
}
//# sourceMappingURL=EIP1193.d.ts.map