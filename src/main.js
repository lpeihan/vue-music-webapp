import Vue from 'vue';
import App from './app';
import router from './route';
import Icon from './icon';
import store from './vuex/store';
import VueLazyload from 'vue-lazyload';

import './utils/axios';
import './styles/index.styl';

Vue.component('icon', Icon);

Vue.use(VueLazyload, {
  loading: require('./assets/images/default.png')
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
