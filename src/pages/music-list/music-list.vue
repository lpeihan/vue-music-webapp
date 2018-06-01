<template>
  <transition name="slide">
    <scroll class="music-list" :data="songs" :bounce-top="false">
      <div>
        <div class="header" ref="header">
          <div class="navbar">
            <div class="back" @click="$router.go(-1)"><icon name="back"></icon></div>
          </div>

          <div class="bg" :style="{ backgroundImage: `url(${musicList.picUrl || imgUrl})` }"></div>
        </div>
        <song-list :songs="songs" @select="selectsong"></song-list>
      </div>
    </scroll>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { getMusicListDetail } from '../../api/recommends';
import SongList from './song-list';
import Scroll from '../../components/scroll';
import { createSong } from '../../services/song';

export default {
  components: {
    SongList,
    Scroll

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

        if (res.status === 200) {
          this.songs = res.data.playlist.tracks.map((song) => {
            return createSong(song);
          });
          this.imgUrl = res.data.playlist.coverImgUrl;
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

    .header
      position: relative

      .bg
        position: relative
        size: 100% 0
        padding-bottom: 70%
        background-size: cover
        &::before
          content: ''
          absolute: top 0 left 0 right 0 bottom 0
          background: rgba(7, 17, 27, 0.3)

      .navbar
        fixed: top 0 left 0 right 0
        height: 50px
        z-index: 1
        color: $white
        .back
          absolute: top 13px left 20px
          .icon
            font-size: 28px
</style>
