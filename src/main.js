import Vue from 'vue';
import App from './app';
import router from './route';
import Icon from './icon';
import store from './vuex/store';
import VueLazyload from 'vue-lazyload';

/* eslint-disable no-unused-vars */
import VConsole from 'vconsole';

import './utils/axios';
import './utils/directives';
import './styles/index.styl';

const vConsole = new VConsole();

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
