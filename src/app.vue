<template>
  <div id="app">
    <headers></headers>

    <tab :style="{ 'height': height + 'px' }" :tabs="tabs">
      <recommends></recommends>
      <div><progress-circle></progress-circle></div>
      <div>3</div>
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
import ProgressCircle from './components/progress-circle';

export default {
  components: {
    Headers,
    Tab,
    Recommends,
    Player,
    ProgressCircle
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
