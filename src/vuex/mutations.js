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
  }
};

export default mutations;
