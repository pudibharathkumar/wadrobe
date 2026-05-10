export declare class SimpleCache {
    private cache;
    set(key: string, value: any, ttlSeconds?: number): void;
    get(key: string): any;
    delete(key: string): void;
}
export declare const cache: SimpleCache;
//# sourceMappingURL=cache.d.ts.map