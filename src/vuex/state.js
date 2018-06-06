import { mode } from '../services/config';
import { getSearchHistoryFromStorage } from '../services/search';

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

  topList: {},

  searchHistory: getSearchHistoryFromStorage() || []
};

export default state;
