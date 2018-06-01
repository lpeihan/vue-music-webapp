import { host } from './config';
import axios from 'axios';

export function getSong(id) {
  return axios.get(host + `/music/url?id=${id}`);
}