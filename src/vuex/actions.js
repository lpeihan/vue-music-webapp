import * as types from './mutation-types';

const actions = {
  selectPlay({ commit, state }, { list, index }) {
    commit(types.SET_PLAY_LIST, list);
    commit(types.SET_SEQUENCE_LIST, list);
    commit(types.SET_CURRENT_INDEX, index);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING, true);
  }
};

export default actions;
