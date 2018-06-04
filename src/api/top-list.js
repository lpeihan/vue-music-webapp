import { host } from './config';
import axios from 'axios';

export function getTopList() {
  return axios.get(host + `/toplist/detail`);
}

export function getTopListDetail(id) {
  return axios.get(host + `/playlist/detail?id=${id}`);
}