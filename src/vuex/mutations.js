import * as types from './mutation-types';

const mutations = {
  [types.SET_MUSIC_LIST](state, musicList) {
    state.musicList = musicList;
  },

  [types.SET_PLAYLIST](state, playlist) {
    state.playlist = playlist;
  },

  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index;
  },

  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag;
  },

  [types.SET_PLAYING](state, flag) {
    state.playing = flag;
  },

  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list;
  },

  [types.SET_MODE](state, mode) {
    state.mode = mode;
  },

  [types.SET_TAB_INDEX](state, index) {
    state.tabIndex = index;
  },

  [types.SET_SINGER](state, singer) {
    state.singer = singer;
  },

  [types.SET_TOP_LIST](state, list) {
    state.topList = list;
  },

  [types.SET_SEARCH_HISTORY](state, history) {
    state.searchHistory = history;
  },

  [types.SET_FAVORITE_LIST](state, list) {
    state.favoriteList = list;
  },

  [types.SET_PLAY_HISTORY](state, history) {
    state.playHistory = history;
  }
};

export default mutations;
