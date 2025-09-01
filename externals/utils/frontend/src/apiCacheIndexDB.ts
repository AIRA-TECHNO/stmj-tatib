const STORE_NAME = 'apiCache';



function openDB(): Promise<IDBDatabase> {
  const DB_NAME = 'ApiCacheDB';
  const DB_VERSION = 1;
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'path' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};



export async function apiGetCache(path: string): Promise<Response | null> {
  const db = await openDB();
  return new Promise((resolve) => {
    const request = db.transaction(STORE_NAME, 'readonly')
      .objectStore(STORE_NAME).get(path);

    request.onsuccess = () => {
      const cached = request.result;
      if (cached && cached.expiredAt >= Date.now()) {
        resolve(new Response(cached.body, {
          status: cached.status,
          statusText: cached.statusText,
          headers: new Headers(cached.headers),
        }));
      } else {
        resolve(null);
      }
    };

    request.onerror = () => resolve(null);
  });
};



export async function apiSetCache(path: string, resp: Response, staleTime: number): Promise<void> {
  const db = await openDB();
  const body = await resp.text();

  return new Promise((resolve, reject) => {
    const data = {
      path,
      expiredAt: Date.now() + staleTime * 1000,
      body,
      status: resp.status,
      statusText: resp.statusText,
      headers: Object.fromEntries(resp.headers.entries()),
    };

    const request = db.transaction(STORE_NAME, 'readwrite')
      .objectStore(STORE_NAME).put(data);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};



export async function apiClearCache(path: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE_NAME, 'readwrite')
      .objectStore(STORE_NAME).delete(path);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
