import { openDB, type DBSchema } from 'idb';

interface VibeTabDB extends DBSchema {
  backgrounds: {
    key: string;
    value: {
      id: string;
      blob: Blob;
      mimeType: string;
      updatedAt: number;
    };
  };
}

const DB_NAME = 'vibetab-db';
const STORE_NAME = 'backgrounds';

/**
 * IndexedDB Wrapper for handling large media files.
 */
export class MediaStorage {
  private dbPromise;

  constructor() {
    this.dbPromise = openDB<VibeTabDB>(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }

  /**
   * Defines a generic method to get data
   */
  public async get(id: string) {
    return (await this.dbPromise).get(STORE_NAME, id);
  }

  /**
   * Stores a media blob.
   */
  public async save(id: string, blob: Blob) {
    return (await this.dbPromise).put(STORE_NAME, {
      id,
      blob,
      mimeType: blob.type,
      updatedAt: Date.now(),
    });
  }

  /**
   * Deletes a media blob.
   */
  public async delete(id: string) {
    return (await this.dbPromise).delete(STORE_NAME, id);
  }

  /**
   * Clear all media.
   */
  public async clear() {
    return (await this.dbPromise).clear(STORE_NAME);
  }
}

export const mediaDB = new MediaStorage();
