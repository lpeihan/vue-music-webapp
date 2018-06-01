<template>
  <div class="player" v-if="playList.length">
    <transition
      name="normal"
      @enter="enter"
      @leave="leave"
    >
      <div class="player-normal" v-show="fullScreen">
        <div class="overlay" :style="{ 'background-image': `url(${currentSong.image})` }"></div>
        <div class="top">
          <div class="back" @click="close(false)">
            <icon name="down"></icon>
          </div>
          <p class="name">{{currentSong.name}}</p>
          <p class="singer">{{currentSong.singer}}</p>
        </div>

        <div class="middle">
          <div class="cd-wrapper" ref="cd">
            <div
              class="cd"
              :style="{ 'background-image': `url(${currentSong.image})` }"
              :class="cdCls"
            ></div>
          </div>
        </div>

        <div class="bottom">
          <div class="btns">
            <div class="mode">
              <icon name="random"></icon>
            </div>
            <div class="prev" @click="prev">
              <icon name="prev"></icon>
            </div>
            <div class="play" @click="togglePlaying">
              <icon :name="playing ? 'pause': 'play'"></icon>
            </div>
            <div class="next" @click="next">
              <icon name="next"></icon>
            </div>
            <div class="playlist">
              <icon name="playlist"></icon>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div class="player-mini" @click="open(true)">
      <div class="img" :style="{ 'background-image': `url(${currentSong.image})` }"></div>

      <div class="text">
        <h2 class="name">{{currentSong.name}}</h2>
        <p class="singer">{{currentSong.singer}}</p>
      </div>

      <div class="right-btns">
        <div class="mini-play" @click.stop="togglePlaying">
          <icon :name="playing ? 'minipause': 'miniplay'"></icon>
        </div>
        <div class="playlist">
          <icon name="playlist"></icon>
        </div>
      </div>
    </div>

    <audio
      ref="audio" :src="url" autoplay="autoplay"
      @timeupdate="updateTime"
      @ended="next"
    ></audio>
  </div>
</template>

<script>
import animations from 'create-keyframe-animation';
import { mapGetters, mapMutations } from 'vuex';
import { getSong } from '../../api/song';

export default {
  data() {
    return {
      url: '',
      currentTime: 0
    };
  },
  computed: {
    ...mapGetters(['fullScreen', 'currentSong', 'playList', 'playing', 'currentIndex']),
    cdCls() {
      return this.playing ? 'play' : 'play pause';
    }
  },
  methods: {
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlaying: 'SET_PLAYING',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    }),
    async getSong(id) {
      try {
        const res = await getSong(id);
        this.url = res.data.data[0].url;
      } catch (err) {

      }
    },
    togglePlaying() {
      this.setPlaying(!this.playing);
    },
    prev() {
      const index = this.currentIndex - 1;

      this.setCurrentIndex(index);
    },
    next() {
      const index = this.currentIndex + 1;

      this.setCurrentIndex(index);
    },
    close() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },
    enter(el, done) {
      const { x, y, scale } = this.getPosAndScale();
      const animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      };

      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      });

      animations.runAnimation(this.$refs.cd, 'move', () => {
        animations.unregisterAnimation('move');
        this.$refs.cd.style.animation = '';
        done();
      });
    },
    leave(el, done) {
      const { x, y, scale } = this.getPosAndScale();
      const cd = this.$refs.cd;

      cd.style.transition = 'all 0.4s';
      cd.style['transform'] = `translate3d(${x}px,${y}px,0) scale(${scale})`;

      cd.addEventListener('transitionend', () => {
        cd.style.transition = '';
        cd.style['transform'] = '';
        done();
      });
    },
    getPosAndScale() {
      const width = innerWidth * 0.65;
      const scale = 40 / width;

      return {
        x: -(innerWidth / 2 - 40),
        y: innerHeight - 150 - width / 2 - 30,
        scale
      };
    }
  },
  watch: {
    async currentSong(song) {
      try {
        await this.getSong(song.id);
        this.setPlaying(true);
      } catch (err) {
        console.log(err);
      }
    },
    playing(playing) {
      const audio = this.$refs.audio;

      if (!this.url) { return; }

      this.$nextTick(() => {
        playing ? audio.play() : audio.pause();
      });
    }
  },
  mounted() {}
};
</script>

<style lang="stylus">
  @import "../../styles/variables"
  @import "../../styles/mixins"

  .player
    &-normal
      fixed: top 0 left 0 right 0 bottom 0
      z-index: 1000
      background: $color-background
      color: $white

      &.normal
        &-enter-active
        &-leave-active
          transition: all .4s
          .top
          .bottom
            transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
        &-enter
        &-leave-to
          opacity: 0
          .top
            transform: translate3d(0, -100px, 0)
          .bottom
            transform: translate3d(0, 100px, 0)

      .overlay
        absolute: left 0 right 0 bottom 0 top 0
        z-index: -1
        filter: blur(30px)
        background-size: 100% 100%
        &::after
          content: ''
          absolute: top -100px left -100px right -100px bottom -100px
          background: $color-overlay

      .top
        position: relative
        text-align: center
        .back
          absolute: top 12px left 24px
          transform: rotate(-90deg)
          padding: 8px
        .name
          padding-top: 8px
          line-height: 36px
          font-size: $font-size-large
        .singer
          line-height: 20px
          font-size: $font-size-medium

      .middle
        absolute: top 120px left 0 right 0 bottom 170px
        display: flex
        justify-content: center

        .cd-wrapper
          size: 65% 0
          padding-bottom: 65%
          border: 10px solid rgba(255, 255, 255, 0.2)
          border-radius: 50%
          position: relative
          overflow: hidden
          .cd
            absolute: top 0 left 0 right 0 bottom 0
            background-size: 100% 100%
            border-radius: 50%
            &.play
              animation: rotate 20s linear infinite
            &.pause
              animation-play-state: paused

          @keyframes rotate
            0%
              transform: rotate(0)
            100%
              transform: rotate(360deg)

      .bottom
        absolute: bottom 44px left 0 right 0
        .btns
          display: flex
          padding: 0 8%
          justify-content: space-around
          align-items: center
          .play
            .icon
              font-size: 36px

    &-mini
      fixed: bottom 0 left 0 right 0
      display: flex
      padding: 0 20px
      align-items: center
      height: 60px
      z-index: 999
      background: $white
      box-shadow: 0 0 4px $color-border

      .img
        size: 40px
        background-size: 100% 100%
        border-radius: 50%
        box-shadow: 0 0 2px $color-text-l
      .text
        width: calc(100% - 80px - 40px)
        padding-left: 10px
        .name
          margin-bottom: 8px
          font-size: $font-size-medium
          no-wrap()
        .singer
          font-size: $font-size-small
          color: $color-text-l
          no-wrap()

      .right-btns
        width: 80px
        align-items: center
        display: flex
        justify-content: space-between
        color: $color-text-l
        relative: top 3px

        .mini-play
          .icon
            font-size: 36px

</style>
