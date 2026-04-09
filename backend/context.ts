import { UserStore } from './auth/userStore';
import { createInMemoryRepositories } from './repositories/inMemoryRepository';
import { createInitialStore } from './state/store';

export const createBackendContext = () => {
  const store = createInitialStore();
  const repositories = createInMemoryRepositories(store);
  const userStore = new UserStore();
  return { store, repositories, userStore };
};
