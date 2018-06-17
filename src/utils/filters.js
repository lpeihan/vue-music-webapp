import Vue from 'vue';

import { leftpad } from './index';

function fillZero(str) {
  return leftpad(str, 2, '0');
}

Vue.filter('date', (value) => {
  const date = new Date(parseInt(value, 10));
  return value ? `${date.getFullYear()}年${fillZero(date.getMonth() + 1)}月\
${fillZero(date.getDate())}日` : '';
});

Vue.filter('highlight', (value, key) => {
  const reg = new RegExp(key, 'g');
  return value.replace(reg, `<span class="highlight-text">${key}</span>`);
});
