export type EncUVD = {
    /**
     * Values to check for when using PIN numbers to ensure they are used in order
     */
    seqNum?: number;
    /**
     * A key that encrypts data encrypted with the wepin's public key.
     */
    b64SKey: string;
    /**
     * data encrypted with the original key in b64SKey
     */
    b64Data: string;
};
export interface EncPinHint {
    /**
     * The version of the hint
     */
    version: number;
    /**
     * The length of the hint
     */
    length: string;
    /**
     * encrypted hint data
     */
    data: string;
}
export interface RegistrationPinBlock {
    /**
     * encrypted PIN
     */
    uvd: EncUVD;
    /**
     * Hints in the encrypted PIN
     */
    hint: EncPinHint;
}
export interface AuthPinBlock {
    /**
     * encypted pin list
     */
    uvdList: EncUVD[];
    /**
     * If OTP authentication is required, include the OTP.
     */
    otp?: string;
}
export interface ChangePinBlock {
    /**
     * The user's existing encrypted PIN
     */
    uvd: EncUVD;
    /**
     * The user's new encrypted PIN
     */
    newUVD: EncUVD;
    hint: EncPinHint;
    otp?: string;
}
export interface AuthOTP {
    /**
     * The OTP entered by the user
     */
    code: string;
}
//# sourceMappingURL=PinBlock.d.ts.map