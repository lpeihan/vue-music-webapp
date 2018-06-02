const getters = {
  musicList: state => state.musicList,

  playlist: state => state.playlist,

  currentIndex: state => state.currentIndex,

  currentSong: state => state.playlist[state.currentIndex],

  fullScreen: state => state.fullScreen,

  playing: state => state.playing,

  sequenceList: state => state.sequenceList,

  mode: state => state.mode
};

export default getters;
