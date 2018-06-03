<template>
  <transition name="slide">
    <div class="music-list">
      <div class="navbar">
        <div class="filter"
          :style="{
            background: `url(${musicList.picUrl}) center`,
            'opacity': this.percent
          }">
        </div>
        <h1 class="name" :style="{'opacity': this.percent }">{{musicList.name}}</h1>
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
          <div class="header">
            <div class="filter" :style="{ background: `url(${musicList.picUrl}) center` }"></div>

            <div class="content">
              <div class="left">
                <img :src="musicList.picUrl" class="img">
              </div>
              <div class="right">
                <h1 class="name">{{musicList.name}}</h1>
                <div class="info">
                  <img :src="avatar" alt="" class="avatar">
                  <span class="nickname">{{nickname}}</span>
                </div>
              </div>
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
      percent: 0,
      avatar: '',
      nickname: ''
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
    async getMusicListDetail(id) {
      try {
        const res = await getMusicListDetail(id);

        if (res.status === 200) {
          this.avatar = res.data.playlist.creator.avatarUrl;
          this.nickname = res.data.playlist.creator.nickname;
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
      this.percent = Math.abs(pos.y / (innerWidth * 0.6));
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
    overflow-x: hidden

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
      overflow: hidden
      .filter
        background-filter(20px, 1.5)

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
            transform: translateY(-20px)
            opacity: 0
      .back
        absolute: top 5px left 10px
        padding: 10px
        .icon
          font-size: 28px

    .header
      position: relative
      height: 0
      padding-bottom: 65%
      .filter
        background-filter()

      .content
        absolute: top 50px left 0 right 0 bottom 0
        display: flex
        padding: 20px 0
        .left
          flex: 0 0 35%
          padding-left: 20px
          .img
            border-radius: 5px
            width: 100%
        .right
          color: $white
          flex: 1
          padding: 0 10px
          .name
            font-size: 17px
            line-height: 28px
            margin-bottom: 20px
          .info
            display: flex
            align-items: center
            .avatar
              size: 32px
              border-radius: 50%
              margin-right: 10px
            .nickname
              color: rgba($white, .8)
              font-size: 15px

    .loading-wrapper
      absolute: top 50% left 50%
      transform: translate3d(-50%, -50%, 0)

</style>
