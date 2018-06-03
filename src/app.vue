<template>
  <div id="app">
    <headers></headers>

    <tab :style="{ 'height': height + 'px' }" :tabs="tabs">
      <recommends></recommends>
      <div>2</div>
      <singers></singers>
    </tab>

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

export default {
  components: {
    Headers,
    Tab,
    Recommends,
    Player,
    Singers
  },
  data() {
    return {
      height: 0,
      tabs: ['推荐', '排行', '歌手']
    };
  },
  mounted() {
    this.height = window.innerHeight - 50;
  }
};
</script>

<style lang="stylus">
</style>
