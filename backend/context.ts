import { UserStore } from './auth/userStore';
import {
  loadPersistedState,
  openSqlite,
  resolveDbPath,
  savePersistedState,
} from './persistence/sqlitePersistence';
import { createInMemoryRepositories } from './repositories/inMemoryRepository';
import { createInitialStore } from './state/store';
import type { AppDataStore } from './types';

export type PersistFn = () => void;

export const createBackendContext = (): {
  store: AppDataStore;
  repositories: ReturnType<typeof createInMemoryRepositories>;
  userStore: UserStore;
  persist: PersistFn | undefined;
  sqlite: ReturnType<typeof openSqlite> | undefined;
} => {
  const dbPath = process.env.FIXUP_DB_PATH?.trim();
  if (!dbPath) {
    const store = createInitialStore();
    const repositories = createInMemoryRepositories(store);
    const userStore = new UserStore();
    return { store, repositories, userStore, persist: undefined, sqlite: undefined };
  }

  const absolutePath = resolveDbPath(dbPath);
  const sqlite = openSqlite(absolutePath);
  const loaded = loadPersistedState(sqlite);

  let store: AppDataStore;
  let userStore: UserStore;

  if (loaded.store && loaded.users && loaded.users.length > 0) {
    store = loaded.store;
    userStore = new UserStore(loaded.users);
  } else {
    store = createInitialStore();
    userStore = new UserStore();
    savePersistedState(sqlite, store, userStore.snapshotUsers());
  }

  const repositories = createInMemoryRepositories(store);
  const persist: PersistFn = () => {
    savePersistedState(sqlite, store, userStore.snapshotUsers());
  };

  return { store, repositories, userStore, persist, sqlite };
};
