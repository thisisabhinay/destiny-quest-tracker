import { openDB } from 'idb';

const DB_NAME = 'destiny2-chronicle-db';
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('d2-data')) {
        db.createObjectStore('d2-data');
      }
      if (!db.objectStoreNames.contains('d2-state')) {
        db.createObjectStore('d2-state');
      }
    },
  });
};

export const fetchAndCacheData = async () => {
  const db = await initDB();
  const cachedData = await db.get('d2-data', 'master');
  
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetch('/data/d2-master-progression-data.json');
    const data = await response.json();
    await db.put('d2-data', data, 'master');
    return data;
  } catch (error) {
    console.error('Failed to fetch D2 master data', error);
    return null;
  }
};

export const getUserState = async (key) => {
  const db = await initDB();
  return db.get('d2-state', key);
};

export const saveUserState = async (key, value) => {
  const db = await initDB();
  return db.put('d2-state', value, key);
};
