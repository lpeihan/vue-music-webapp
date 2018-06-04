const getters = {
  musicList: state => state.musicList,

  playlist: state => state.playlist,

  currentIndex: state => state.currentIndex,

  currentSong: state => state.playlist[state.currentIndex] || {},

  fullScreen: state => state.fullScreen,

  playing: state => state.playing,

  sequenceList: state => state.sequenceList,

  mode: state => state.mode,

  tabIndex: state => state.tabIndex,

  singer: state => state.singer,

  topList: state => state.topList
};

export default getters;
