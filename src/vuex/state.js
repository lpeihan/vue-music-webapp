import { mode } from '../services/config';

const state = {
  musicList: {},

  playList: {},

  sequenceList: {},

  currentIndex: -1,

  fullScreen: false,

  playing: false,

  mode: mode.loop
};

export default state;
