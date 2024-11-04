export default class LOG {
    static test: (...args: any[]) => void;
    static warn: (...args: any[]) => void;
    static error: (...args: any[]) => void;
    static todo: (...args: any[]) => void;
    static assert: (value: any, message?: string, ...optionalParams: any[]) => void;
    static debug: (_thisArg: any, ..._argArray: any[]) => void;
}
//# sourceMappingURL=log.d.ts.map