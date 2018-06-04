import { host } from './config';
import axios from 'axios';

export function getSingers () {
  return axios.get(host + '/top/artists?limit=100');
}

export function getSingerDetail(id) {
  return axios.get(host + `/artists?id=${id}`);
}