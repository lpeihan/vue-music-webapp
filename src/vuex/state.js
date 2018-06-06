import { mode } from '../services/config';
import { loadSearchHistory, loadFavoriteList, loadPlayHistory } from '../services/cache';

const state = {
  musicList: {},

  playlist: [],

  sequenceList: [],

  currentIndex: -1,

  fullScreen: false,

  playing: false,

  mode: mode.loop,

  singer: {},

  topList: {},

  searchHistory: loadSearchHistory() || [],

  favoriteList: loadFavoriteList() || [],

  playHistory: loadPlayHistory() || []
};

export default state;
