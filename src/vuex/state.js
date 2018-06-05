import { mode } from '../services/config';

const state = {
  musicList: {},

  playlist: [],

  sequenceList: [],

  currentIndex: -1,

  fullScreen: false,

  playing: false,

  mode: mode.loop,

  tabIndex: 0,

  singer: {},

  topList: {}
};

export default state;
