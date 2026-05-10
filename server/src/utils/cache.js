export class SimpleCache {
    cache = new Map();
    set(key, value, ttlSeconds = 3600) {
        this.cache.set(key, {
            value,
            expiry: Date.now() + ttlSeconds * 1000,
        });
    }
    get(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return null;
        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return null;
        }
        return entry.value;
    }
    delete(key) {
        this.cache.delete(key);
    }
}
export const cache = new SimpleCache();
//# sourceMappingURL=cache.js.map