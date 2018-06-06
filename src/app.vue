<template>
  <div id="app">
    <headers></headers>

    <tab :style="{ 'height': height + 'px' }" :tabs="tabs" :tab-index.sync="tabIndex">
      <recommends></recommends>
      <top-list :tab-index="tabIndex"></top-list>
      <singers :tab-index="tabIndex"></singers>
    </tab>

    <div ref="test1">1</div>
    <div ref="test1">1</div>
    <div ref="test2">2</div>

    <player></player>
    <router-view></router-view>
  </div>
</template>

<script>
import Headers from './pages/header/header';
import Tab from './components/tab';
import Recommends from './pages/recommends/Recommends';
import Player from './pages/player/player';
import Singers from './pages/singers/singers';
import TopList from './pages/top-list/top-list';

export default {
  components: {
    Headers,
    Tab,
    Recommends,
    Player,
    Singers,
    TopList
  },
  data() {
    return {
      height: 0,
      tabs: ['推荐', '排行', '歌手'],
      tabIndex: 0
    };
  },
  mounted() {
    this.height = window.innerHeight - 50;
  }
};
</script>

<style lang="stylus">
</style>
