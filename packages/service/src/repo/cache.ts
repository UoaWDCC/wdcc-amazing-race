export class RepositoryCache<T> {
  private dataStore: T[];
  private lastCacheTime: EpochTimeStamp;
  private cacheLifetimeSecs: number;

  constructor(cacheLifetimeSecs: number = 60) {
    this.dataStore = null;
    this.cacheLifetimeSecs = cacheLifetimeSecs;
  }

  public resetCache(items: T[]) {
    this.dataStore = items;
  }

  public isExpired(): boolean {
    return !this.dataStore || this.lastCacheTime + this.cacheLifetimeSecs < Date.now() / 1_000;
  }

  public async getData(): Promise<T[]> {
    return this.dataStore;
  }

  public addToCache(item: T) {
    this.dataStore.push(item);
  }
}
