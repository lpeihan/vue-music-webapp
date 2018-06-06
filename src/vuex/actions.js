import * as types from './mutation-types';
import { cacheSearchHistory, cacheFavoriteList, cachePlayHistory } from '../services/cache';

const actions = {
  selectPlay({ commit, state }, { list, index }) {
    commit(types.SET_PLAYLIST, list);
    commit(types.SET_SEQUENCE_LIST, list);
    commit(types.SET_CURRENT_INDEX, index);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING, true);
  },

  deleteSong({ commit, state, dispatch }, { song }) {
    const playlist = state.playlist.slice();
    const sequenceList = state.sequenceList.slice();
    let currentIndex = state.currentIndex;

    if (playlist.length === 1) {
      dispatch('clearPlaylist');
      return;
    }

    const pIndex = playlist.findIndex(item => item.id === song.id);
    const sIndex = sequenceList.findIndex(item => item.id === song.id);

    playlist.splice(pIndex, 1);
    sequenceList.splice(sIndex, 1);

    if (currentIndex > pIndex || currentIndex === playlist.length) {
      currentIndex--;
    }

    commit(types.SET_PLAYLIST, playlist);
    commit(types.SET_SEQUENCE_LIST, sequenceList);
    commit(types.SET_CURRENT_INDEX, currentIndex);
  },

  clearPlaylist({ commit }) {
    commit(types.SET_FULL_SCREEN, false);
    commit(types.SET_PLAYLIST, []);
    commit(types.SET_SEQUENCE_LIST, []);
    commit(types.SET_CURRENT_INDEX, -1);
    commit(types.SET_PLAYING, false);
  },

  insertSong({ commit, state }, song) {
    const playlist = state.playlist.slice();
    const sequenceList = state.sequenceList.slice();

    const fIndex = playlist.findIndex(item => {
      return item.id === song.id;
    });

    let index = 0;

    if (fIndex > -1) {
      index = fIndex;
    } else {
      playlist.unshift(song);
      sequenceList.unshift(song);
    }

    commit(types.SET_PLAYLIST, playlist);
    commit(types.SET_SEQUENCE_LIST, sequenceList);
    commit(types.SET_CURRENT_INDEX, index);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING, true);
  },

  saveSearchHistory({ commit, state }, query) {
    const searchHistory = state.searchHistory.slice();

    const index = searchHistory.findIndex(item => item === query);

    if (index > -1) {
      searchHistory.splice(index, 1);
    }

    searchHistory.unshift(query);

    if (searchHistory.length > 10) {
      searchHistory.pop();
    }

    commit(types.SET_SEARCH_HISTORY, cacheSearchHistory(searchHistory));
  },

  deleteSearchHitory({ commit, state }, index) {
    const searchHistory = state.searchHistory.slice();

    searchHistory.splice(index, 1);

    commit(types.SET_SEARCH_HISTORY, cacheSearchHistory(searchHistory));
  },

  clearSearchHistory({ commit }) {
    commit(types.SET_SEARCH_HISTORY, cacheSearchHistory([]));
  },

  saveFavoriteList({ commit, state }, song) {
    const favoriteList = state.favoriteList.slice();

    const index = favoriteList.findIndex(item => item.id === song.id);

    if (index > -1) {
      favoriteList.splice(index, 1);
    }

    favoriteList.unshift(song);

    if (favoriteList.length > 100) {
      favoriteList.pop();
    }

    commit(types.SET_FAVORITE_LIST, cacheFavoriteList(favoriteList));
  },

  deleteFavoriteList({ commit, state }, song) {
    const favoriteList = state.favoriteList.slice();

    const index = favoriteList.findIndex(item => song.id === item.id);

    favoriteList.splice(index, 1);
    commit(types.SET_FAVORITE_LIST, cacheFavoriteList(favoriteList));
  },

  savePlayHistory({ commit, state }, song) {
    const playHistory = state.playHistory.slice();

    const index = playHistory.findIndex(item => item.id === song.id);

    if (index > -1) {
      playHistory.splice(index, 1);
    }

    playHistory.unshift(song);

    if (playHistory.length > 100) {
      playHistory.pop();
    }

    commit(types.SET_PLAY_HISTORY, cachePlayHistory(playHistory));
  }
};

export default actions;
