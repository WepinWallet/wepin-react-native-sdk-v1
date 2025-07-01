export interface ProviderInfo {
    /**
     * A UUIDv4 unique to the wallet provider.
     *
     * This must remain the same across versions but must be different across channels. For example, MetaMask, Trust wallet and Enkrypt should each have different UUIDs, but MetaMask 10.22.2 and MetaMask 9.8.1 should have the same UUID.
     *
     * @readonly
     */
    uuid: string;
    /**
     * The name of the wallet provider (e.g. `MetaMask` or `Enkrypt`)
     *
     * @readonly
     */
    name: string;
    /**
     * A base64 encoded SVG image.
     *
     * Base64 is defined in RFC 4648.
     *
     * @readonly
     */
    icon: `data:image/svg+xml;base64,${string}`;
    /**
     * A description of the wallet provider.
     *
     * @readonly
     */
    description: string;
}
//# sourceMappingURL=EIP5749.d.ts.map