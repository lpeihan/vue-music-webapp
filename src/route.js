import Vue from 'vue';
import Router from 'vue-router';
import RecommendDetail from './pages/recommends/recommend-detail';
import SingerDetail from './pages/singers/singer-detail';
import TopListDetail from './pages/top-list/top-list-detail';
import Search from './pages/search/search';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/recommends/:id',
      name: 'recommendsDetail',
      component: RecommendDetail
    },
    {
      path: '/singers/:id',
      name: 'singerDetail',
      component: SingerDetail
    },
    {
      path: '/top-list/:id',
      name: 'topListDetail',
      component: TopListDetail
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
      children: [
        {
          path: 'singers/:id',
          component: SingerDetail
        },
        {
          path: 'recommends/:id',
          component: RecommendDetail
        }
      ]
    }
  ]
});
