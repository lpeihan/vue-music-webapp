import { host } from './config';
import axios from 'axios';

export function getBanners () {
  return axios.get(host + '/banner');
}

export function getRecommends() {
  return axios.get(host + '/personalized');
}

export function getRecommendDetail(id) {
  return axios.get(host + `/playlist/detail?id=${id}`);
}