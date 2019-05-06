<template>
  <transition>
    <div class="users">

      <div class="back" @click="$router.go(-1)">
        <icon name="back"></icon>
      </div>
      <tab class="users-tab" :tabs="tabs" :tab-index.sync="tabIndex">
        <scroll class="favorite" :data="favoriteList" ref="favorite">
          <song-list :songs="favoriteList" @select="selectFavorite" v-if="favoriteList.length"></song-list>
          <empty v-else></empty>
        </scroll>
        <scroll class="play-history" :data="playHistory" ref="history">
          <song-list :songs="playHistory" @select="selectPlayHistory" v-if="playHistory.length"></song-list>
          <empty v-else></empty>
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
import Empty from '../../components/empty';

export default {
  mixins: [
    playlistMixin
  ],
  components: {
    Tab,
    SongList,
    Scroll,
    Empty
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
    appendBottom() {
      if (this.playlist.length) {
        this.$el.style.height = 'calc(100% - 60px)';
      } else {
        this.$el.style.height = '100%';
      }

      setTimeout(() => {
        this.$refs.favorite.refresh();
        this.$refs.history.refresh();
      });
    },
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
