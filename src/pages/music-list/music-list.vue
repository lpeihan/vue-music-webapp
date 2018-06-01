<template>
  <transition name="slide">
    <div class="music-list">
      <div class="navbar">
        <div class="back" @click="$router.go(-1)">
          <icon name="back"></icon>
        </div>
      </div>
      <scroll :data="songs" :bounce-top="false">
        <div>
          <div class="bg"
            :style="{ backgroundImage: `url(${musicList.picUrl || imgUrl})` }"></div>

          <song-list :songs="songs" @select="selectsong"></song-list>
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

export default {
  components: {
    SongList,
    Scroll,
    Loading

  },
  data() {
    return {
      songs: [],
      imgUrl: ''
    };
  },
  computed: {
    ...mapGetters(['musicList'])
  },
  methods: {
    ...mapActions(['selectPlay']),
    async getMusicListDetail(id) {
      try {
        const res = await getMusicListDetail(id);

        this.imgUrl = res.data.playlist.coverImgUrl;

        if (res.status === 200) {
          this.songs = res.data.playlist.tracks.map((song) => {
            return createSong(song);
          });
        }
      } catch (err) {

      }
    },
    selectsong(song, index) {
      this.selectPlay({ list: this.songs, index });
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
      height: 50px
      z-index: 1
      color: $white
      .back
        absolute: top 5px left 10px
        padding: 10px
        .icon
          font-size: 28px

    .bg
      position: relative
      size: 100% 0
      padding-bottom: 70%
      background-size: cover
      &::before
        content: ''
        absolute: top 0 left 0 right 0 bottom 0
        background: $color-overlay

    .loading-wrapper
      absolute: top 50% left 50%
      transform: translate3d(-50%, -50%, 0)

</style>
