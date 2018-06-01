import * as types from './mutation-types';

const mutations = {
  [types.SET_MUSIC_LIST](state, musicList) {
    state.musicList = musicList;
  },

  [types.SET_PLAY_LIST](state, playList) {
    state.playList = playList;
  },

  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index;
  },

  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag;
  },

  [types.SET_PLAYING](state, flag) {
    state.playing = flag;
  }
};

export default mutations;
