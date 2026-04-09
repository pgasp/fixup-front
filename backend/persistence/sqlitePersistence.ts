import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import type { StoredUser } from '../auth/types';
import type { AppDataStore } from '../types';

type SqliteDb = Database.Database;

const APP_KEY = 'app_store';
const USERS_KEY = 'users';

export const resolveDbPath = (dbPath: string): string => {
  return path.isAbsolute(dbPath) ? dbPath : path.join(process.cwd(), dbPath);
};

export const ensureDbDirectory = (absolutePath: string): void => {
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const openSqlite = (absolutePath: string): SqliteDb => {
  ensureDbDirectory(absolutePath);
  const db = new Database(absolutePath);
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS kv (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);
  return db;
};

export const loadPersistedState = (db: SqliteDb): { store: AppDataStore | null; users: StoredUser[] | null } => {
  const appRow = db.prepare('SELECT value FROM kv WHERE key = ?').get(APP_KEY) as { value: string } | undefined;
  const usersRow = db.prepare('SELECT value FROM kv WHERE key = ?').get(USERS_KEY) as { value: string } | undefined;
  if (!appRow?.value || !usersRow?.value) {
    return { store: null, users: null };
  }
  try {
    return {
      store: JSON.parse(appRow.value) as AppDataStore,
      users: JSON.parse(usersRow.value) as StoredUser[],
    };
  } catch {
    return { store: null, users: null };
  }
};

export const savePersistedState = (db: SqliteDb, store: AppDataStore, users: StoredUser[]): void => {
  const upsert = db.prepare('INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)');
  upsert.run(APP_KEY, JSON.stringify(store));
  upsert.run(USERS_KEY, JSON.stringify(users));
};
