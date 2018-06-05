import { host } from './config';
import axios from 'axios';

export function getSearchHot() {
  return axios.get(host + `/search/hot`);
}

export function getSearchSuggest(keywords) {
  return axios.get(host + `/search/suggest?keywords=${keywords}`);
}

export function getSearchSinger(keywords) {
  return axios.get(host + `/search?keywords=${keywords}&type=100&limit=1`);
}

export function getSearchSongs(keywords, offset = 0, limit = 30) {
  return axios.get(host + `/search?keywords=${keywords}&offset=${offset}&limit=${limit}`);
}

export function getSearchMusicList(keywords) {
  return axios.get(host + `/search?keywords=${keywords}&type=1000&limit=1`);
}

export function getSongDetail (id) {
  return axios.get(host + `/song/detail?ids=${id}`);
}
