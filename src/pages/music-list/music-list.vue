<template>
  <transition name="slide">
    <div class="music-list">
      <div class="navbar" :style="{ 'background-color': `rgba(212, 68, 57, ${percent})` }">
        <transition name="name">
          <h1 class="name" v-show="this.percent >= 1">{{musicList.name}}</h1>
        </transition>
        <div class="back" @click="$router.go(-1)">
          <icon name="back"></icon>
        </div>
      </div>
      <scroll
        ref="scroll"
        :data="songs"
        :bounce-top="false"
        :listen-scroll="true"
        :probe-type="3"
        @scroll="scroll"
      >
        <div>
          <div class="bg"
            :style="{ backgroundImage: `url(${musicList.picUrl})` }">
            <div class="text" v-show="show">
              <h1 class="name">{{musicList.name}}</h1>
              <p class="play-count"><icon name="headphones"></icon>{{count}}万</p>
            </div>
          </div>

          <song-list :songs="songs" @select="selectSong"></song-list>
        </div>

        <div class="loading-wrapper">
          <loading v-show="!songs.length"></loading>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { getMusicListDetail } from '../../api/recommends';
import SongList from './song-list';
import Scroll from '../../components/scroll';
import { createSong } from '../../services/song';
import Loading from '../../components/loading';
import { playlistMixin } from '../../utils/mixins';

export default {
  mixins: [
    playlistMixin
  ],
  components: {
    SongList,
    Scroll,
    Loading

  },
  data() {
    return {
      songs: [],
      show: true,
      percent: 0
    };
  },
  computed: {
    ...mapGetters(['musicList']),
    count() {
      return Math.round(this.musicList.playCount / 10000);
    }
  },
  methods: {
    ...mapActions(['selectPlay']),
    handlePlaylist(playlist) {
      if (playlist.length) {
        this.appendBottm(this.$refs.scroll.$el.children[0]);
        this.$refs.scroll.refresh();
      }
    },
    async getMusicListDetail(id) {
      try {
        const res = await getMusicListDetail(id);

        if (res.status === 200) {
          this.songs = res.data.playlist.tracks.map((song) => {
            return createSong(song);
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    selectSong(song, index) {
      this.selectPlay({ list: this.songs, index });
    },
    scroll(pos) {
      this.percent = Math.abs(pos.y / (innerWidth * 0.7));
    }
  },
  created() {
    this.getMusicListDetail(this.musicList.id || this.$route.params.id);
  }
};
</script>

<style lang="stylus">
  @import "../../styles/variables"
  @import "../../styles/mixins"

  .music-list
    fixed: top 0 left 0 right 0 bottom 0
    background: $color-background
    z-index: 10

    &.slide
      &-enter-active
      &-leave-active
        transition: all .4s
      &-enter
      &-leave-to
        transform: translateX(100%)

    .navbar
      fixed: top 0 left 0 right 0
      height: 60px
      z-index: 1
      color: $white
      .name
        line-height: 65px
        font-size: 17px
        padding: 0 35px 0 45px
        text-align: center
        no-wrap()
        &.name
          &-enter-active
          &-leave-active
            transition: all 0.4s
          &-enter
          &-leave-to
            transform: translateY(-50px)
      .back
        absolute: top 5px left 10px
        padding: 10px
        .icon
          font-size: 28px

    .bg
      position: relative
      size: 100% 0
      padding-bottom: 70%
      height: 0
      background-size: cover
      &::before
        content: ''
        absolute: top 0 left 0 right 0 bottom 0
        background: $color-overlay
      .text
        absolute: bottom 20px left 20px right 20px
        color: $white
        .name
          font-size: 17px

        .play-count
          margin-top: 10px
          font-size: $font-size-small
          .icon
            font-size: 14px
            relative: top 2px
            margin-right: 2px

    .loading-wrapper
      absolute: top 50% left 50%
      transform: translate3d(-50%, -50%, 0)

</style>
