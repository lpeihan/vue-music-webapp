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
          <div class="progress-wrapper">
            <div class="current-time">{{currentTime | time}}</div>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @update="updateProgress"></progress-bar>
            </div>
            <div class="duration">{{duration | time}}</div>
          </div>
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
import { getSong, getLyric } from '../../api/song';
import ProgressBar from '../../components/progress-bar';
import { leftpad } from '../../utils';
import LyricParser from 'lyric-parser';

export default {
  components: {
    ProgressBar
  },
  data() {
    return {
      url: '',
      duration: 0,
      currentTime: 0,
      lyric: ''
    };
  },
  computed: {
    ...mapGetters(['fullScreen', 'currentSong', 'playList', 'playing', 'currentIndex']),
    cdCls() {
      return this.playing ? 'play' : 'play pause';
    },
    percent() {
      return this.duration ? this.currentTime / this.duration : 0;
    }
  },
  filters: {
    time(time) {
      time = time | 0;
      return `${time / 60 | 0}:${leftpad(time % 60, 2, 0)}`; // minite:second
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
        this.url = (await getSong(id)).data.data[0].url;
      } catch (err) {
        console.log(err);
      }
    },
    async getLyric(id) {
      try {
        const lyric = (await getLyric(id)).data.lrc.lyric;
        this.lyric = new LyricParser(lyric, this.handleLyric);

        this.playing && this.lyric.play();
      } catch (err) {
        console.log(err);
      }
    },
    handleLyric({lineNum, txt}) {
      console.log(lineNum, txt);
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
    updateProgress(percent) {
      this.$refs.audio.currentTime = percent * this.duration;
      !this.playing && this.togglePlaying();
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
      this.currentTime = 0;
      this.duration = 0;
      this.url = '';
      this.lyric && this.lyric.stop();

      await Promise.all([
        this.getSong(song.id),
        this.getLyric(song.id)
      ]);

      this.setPlaying(true);

      const timer = setInterval(() => {
        if (this.duration) {
          clearInterval(timer);
        }
        this.duration = this.$refs.audio.duration;
      }, 300);
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
        height: 100px
        padding-top: 10px

        .back
          absolute: top 12px left 20px
          transform: rotate(-90deg)
          padding: 8px
        .name
          line-height: 30px
          margin: 0 60px
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

        .progress-wrapper
          padding: 0 10%
          height: 70px
          display: flex
          align-items: center
          .progress-bar-wrapper
            flex: 1
            margin: 0 10px
          .current-time, .duration
            font-size: $font-size-small + 1
            color: $color-text-ll

        .btns
          display: flex
          padding: 0 8%
          justify-content: space-between
          align-items: center
          .play
            .icon
              font-size: 40px

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
