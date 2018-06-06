<template>
  <transition>
    <div class="users">

      <div class="back" @click="$router.go(-1)">
        <icon name="back"></icon>
      </div>
      <tab class="users-tab" :tabs="tabs" :tab-index.sync="tabIndex">
        <scroll class="favorite" :data="favoriteList" ref="scroll">
          <song-list :songs="favoriteList" @select="selectFavorite"></song-list>
        </scroll>
        <scroll class="play-history" :data="playHistory" ref="scroll1">
          <song-list :songs="playHistory" @select="selectPlayHistory"></song-list>
        </scroll>
      </tab>
    </div>
  </transition>
</template>

<script>
import Tab from '../../components/tab';
import { mapGetters, mapActions } from 'vuex';
import SongList from '../music-list/song-list';
import Scroll from '../../components/scroll';
import { playlistMixin } from '../../utils/mixins';

export default {
  mixins: [
    playlistMixin
  ],
  components: {
    Tab,
    SongList,
    Scroll
  },
  data() {
    return {
      tabs: ['我的收藏', '最近播放'],
      tabIndex: 0
    };
  },
  computed: {
    ...mapGetters(['favoriteList', 'playHistory'])
  },
  methods: {
    ...mapActions(['selectPlay', 'insertSong']),
    selectPlayHistory(song, index) {
      this.insertSong(song);
    },
    selectFavorite(song, index) {
      this.selectPlay({ list: this.favoriteList, index });
    }
  }
};
</script>

<style lang="stylus">
  @import "../../styles/variables"
  @import "../../styles/mixins"

  .users
    fixed: top 0 left 0 right 0 bottom 0
    background: $color-background
    &.v
      &-enter-active
      &-leave-active
        transition: all .4s
      &-enter
      &-leave-to
        transform: translate3d(-100%, 0, 0)

    .back
      color: $white
      absolute: top 11px left 15px
      z-idnex: 1
      .icon
        font-size: 28px

    .favorite
    .play-history
      height: 100%

    &-tab
      height: 100%

      .tab-titles
        width: calc(100% - 120px)
        margin: 0 auto

        &::after
          absolute: top 0 left -60px right -60px
          z-index: -1
          height: 50px
          content: ''
          background: $color-theme
</style>
