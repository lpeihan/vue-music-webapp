import { host } from './config';
import axios from 'axios';

export function getSong(id) {
  return axios.get(host + `/music/url?id=${id}`);
}

export function getLyric (id) {
  return axios.get(host + `/lyric?id=${id}`);
}

export function getComments(id) {
  return axios.get(host + `/comment/music?id=${id}`);
}
