import storage from '../utils/cache';

const SEARCH_SHITORY = '__SEARCH_HISTORY__';
const FAVORITE_LIST = '__FAVORITE_LIST__';
const PLAY_HISTORY = '__PLAY_HISTORY__';

export function loadSearchHistory() {
  return storage.getItem(SEARCH_SHITORY);
}

export function cacheSearchHistory(history) {
  return storage.setItem(SEARCH_SHITORY, history);
}

export function loadFavoriteList() {
  return storage.getItem(FAVORITE_LIST);
}

export function cacheFavoriteList(list) {
  return storage.setItem(FAVORITE_LIST, list);
}

export function loadPlayHistory() {
  return storage.getItem(PLAY_HISTORY);
}

export function cachePlayHistory(history) {
  return storage.setItem(PLAY_HISTORY, history);
}
