<template>
  <transition name="slide">
    <div class="music-list">
      <div class="navbar">
        <div class="filter" :style="{ background: `url(${image}) center`,
          'opacity': this.percent
        }">
        </div>
        <h1 class="name" :style="{'opacity': this.percent }">{{title}}</h1>
        <div class="back" @click="$router.go(-1)">
          <icon name="back"></icon>
        </div>
      </div>
      <scroll ref="scroll"
        :data="songs"
        :bounce-top="false"
        :listen-scroll="true"
        :probe-type="3"
        @scroll="scroll"
      >
        <div>
          <div class="header">
            <div class="filter" :style="{ background: `url(${image}) center` }"></div>

            <div class="content">
              <div class="left">
                <img :src="image" class="img">
              </div>
              <div class="right">
                <h1 class="name">{{title}}</h1>
                <div class="info" v-if="avatar">
                  <img :src="avatar" alt="" class="avatar">
                  <span class="nickname">{{nickname}}</span>
                </div>
                <div class="desc" v-else>{{desc}}</div>
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
import SongList from './song-list';
import Scroll from '../../components/scroll';
import Loading from '../../components/loading';
import { playlistMixin } from '../../utils/mixins';
import { mapActions } from 'vuex';

export default {
  mixins: [
    playlistMixin
  ],
  components: {
    SongList,
    Scroll,
    Loading
  },
  props: {
    songs: {
      type: Array,
      default: () => []
    },
    avatar: {
      type: String,
      default: ''
    },
    nickname: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      percent: 0
    };
  },
  methods: {
    ...mapActions(['selectPlay']),
    selectSong(song, index) {
      this.selectPlay({ list: this.songs, index });
    },
    scroll(pos) {
      this.percent = Math.abs(pos.y / (innerWidth * 0.6));
    }
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
        line-height: 60px
        font-size: $font-size-medium-x
        padding: 0 35px 0 45px
        text-align: center
        no-wrap()

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
          position: relative
          .name
            font-size: $font-size-large - 1
            line-height: 28px
            margin-bottom: 20px
          .desc
            absolute: bottom 20px
            color: rgba($white, .8)
            font-size: $font-size-medium
            line-height: 20px
          .info
            display: flex
            align-items: center
            .avatar
              size: 32px
              border-radius: 50%
              margin-right: 10px
            .nickname
              color: rgba($white, .8)
              font-size: $font-size-medium

    .loading-wrapper
      absolute: top 50% left 50%
      transform: translate3d(-50%, -50%, 0)

</style>
