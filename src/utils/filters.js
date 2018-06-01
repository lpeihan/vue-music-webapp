import Vue from 'vue';

import { leftpad } from './index';

function fillZero(str) {
  return leftpad(str, 2, '0');
}

Vue.filter('date', (value) => {
  const date = new Date(parseInt(value, 10));
  return value ? `${date.getFullYear()}-${fillZero(date.getMonth() + 1)}-\
${fillZero(date.getDate())} ${fillZero(date.getHours())}:\
${fillZero(date.getMinutes())}:${fillZero(date.getSeconds())}` : '';
});
