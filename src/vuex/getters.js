const getters = {
  musicList: state => state.musicList,

  playList: state => state.playList,

  currentIndex: state => state.currentIndex,

  currentSong: state => state.playList[state.currentIndex],

  fullScreen: state => state.fullScreen,

  playing: state => state.playing
};

export default getters;
