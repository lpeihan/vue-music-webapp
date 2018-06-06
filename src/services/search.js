import storage from '../utils/cache';

const SEARCH_SHITORY_KEY = '__SEARCH_HISTORY__';

export function getSearchHistoryFromStorage() {
  return storage.getItem(SEARCH_SHITORY_KEY);
}

export function saveSearchHistoryToStorage(query) {
  return storage.setItem(SEARCH_SHITORY_KEY, query);
}
