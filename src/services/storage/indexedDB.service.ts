export class IndexedDBService {
  private dbName = 'VibeTabDB'
  private version = 1
  private db: IDBDatabase | null = null

  async connect(): Promise<IDBDatabase> {
    if (this.db) return this.db

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      
      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result
        
        // Settings Store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' })
        }
        
        // Large Data Store (e.g. cached backgrounds)
        if (!db.objectStoreNames.contains('blobCache')) {
          db.createObjectStore('blobCache', { keyPath: 'id' })
        }
      }
    })
  }

  async put(storeName: string, value: any, key?: IDBValidKey): Promise<IDBValidKey> {
    const db = await this.connect()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite')
      const store = tx.objectStore(storeName)
      const request = key ? store.put(value, key) : store.put(value)
      
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async get(storeName: string, key: IDBValidKey): Promise<any> {
    const db = await this.connect()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly')
      const store = tx.objectStore(storeName)
      const request = store.get(key)
      
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }
}

export const dbService = new IndexedDBService()
