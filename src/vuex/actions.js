import * as types from './mutation-types';

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

    if (playlist.length === 1) { // 如果歌曲长度为一，则清空播放列表
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
  }
};

export default actions;
