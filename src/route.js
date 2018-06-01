import Vue from 'vue';
import Router from 'vue-router';
import MusicList from './pages/music-list/music-list';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/recommends/:id',
      name: 'musicList',
      component: MusicList
    }
  ]
});
