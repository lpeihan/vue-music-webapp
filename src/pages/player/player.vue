<template>
  <div class="player" v-if="playlist.length">
    <transition name="normal" @enter="enter" @leave="leave">
      <div class="player-normal" v-show="fullScreen">
        <div class="overlay" :style="{ 'background-image': `url(${currentSong.image})` }"></div>
        <div class="top">
          <div class="back" @click="back">
            <icon name="down"></icon>
          </div>
          <p class="name">{{currentSong.name}}</p>
          <p class="singer">{{currentSong.singer}}</p>
        </div>

        <div class="middle" @click="showLyric = !showLyric">
          <div class="cd-wrapper" ref="cd" v-show="!showLyric">
            <div
              class="cd"
              :style="{ 'background-image': `url(${currentSong.image})` }"
              :class="cdCls"
            >
            </div>
          </div>
          <scroll class="lyric-wrapper" v-show="showLyric" ref="lyricWrapper" :data="lyric.lines">
            <div>
              <p
                v-for="(line, index) in lyric.lines" :key="index"  class="line" ref="line"
                :class="{ 'active': index === currentLineNum }"
              >
                {{line.txt}}
              </p>
            </div>
          </scroll>
        </div>

        <div class="bottom">
          <div class="top-btns" v-show="!showLyric">
            <div @click="toggleFavorite(currentSong)" :class="{ 'favorite': isFavorite }">
              <icon :name="isFavorite ? 'favorite' : 'unfavorite'"></icon>
            </div>
            <div>
              <icon name="download"></icon>
            </div>
            <div class="comment" @click="$router.push(`/music/comment/${currentSong.id}/full-screen`)">
              <div class="count">{{totalComments}}+</div>
              <icon name="comment"></icon>
            </div>
            <div>
              <icon name="more"></icon>
            </div>
          </div>
          <div class="progress-wrapper">
            <div class="current-time">{{currentTime | time}}</div>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @update="updateProgress"></progress-bar>
            </div>
            <div class="duration">{{duration | time}}</div>
          </div>
          <div class="btns">
            <div class="mode" @click="changeMode">
              <icon :name="modeName"></icon>
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
            <div class="playlist" @click="openPlaylist">
              <icon name="playlist"></icon>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div class="player-mini" @click="open()">
      <div class="img" :style="{ 'background-image': `url(${currentSong.image})` }"></div>

      <div class="text">
        <h2 class="name">{{currentSong.name}}</h2>
        <p class="singer">{{currentSong.singer}}</p>
      </div>

      <div class="right-btns">
        <div class="mini-play" @click.stop="togglePlaying">
          <icon :name="playing ? 'minipause': 'miniplay'"></icon>
        </div>
        <div class="playlist" @click.stop="openPlaylist">
          <icon name="playlist"></icon>
        </div>
      </div>
    </div>
    <playlist ref="playlist" :mode-name="modeName" @changeMode="changeMode"></playlist>
    <toast ref="toast"></toast>
    <audio
      ref="audio" :src="url" autoplay="autoplay"
      @timeupdate="updateTime"
      @canplay="ready"
      @ended="ended">
    </audio>
  </div>
</template>

<script>
import animations from 'create-keyframe-animation';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { getSong, getLyric, getComments } from '../../api/song';
import ProgressBar from '../../components/progress-bar';
import { leftpad, shuffle } from '../../utils';
import LyricParser from 'lyric-parser';
import Scroll from '../../components/scroll';
import { mode } from '../../services/config';
import Playlist from '../playlist/playlist';
import Toast from '../../components/toast';

export default {
  components: {
    ProgressBar,
    Scroll,
    Playlist,
    Toast
  },
  data() {
    return {
      url: '',
      duration: 0,
      currentTime: 0,
      lyric: '',
      showLyric: false,
      currentLineNum: 0,
      playingLyric: '',
      totalComments: 0
    };
  },
  computed: {
    ...mapGetters([
      'fullScreen', 'currentSong', 'playlist', 'playing', 'currentIndex', 'mode', 'sequenceList', 'favoriteList'
    ]),
    cdCls() {
      return this.playing ? 'play' : 'play pause';
    },
    modeName() {
      return this.mode === mode.loop ? 'loop' : this.mode === mode.random ? 'random' : 'once';
    },
    percent() {
      return this.duration ? this.currentTime / this.duration : 0;
    },
    modeText() {
      return this.modeName === 'loop' ? '循环播放' : this.modeName === 'random' ? '随机播放' : '单曲循环';
    },
    isFavorite() {
      const index = this.favoriteList.findIndex(item => item.id === this.currentSong.id);

      return index > -1;
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
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setMode: 'SET_MODE',
      setPlaylist: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'savePlayHistory',
      'saveFavoriteList',
      'deleteFavoriteList'
    ]),
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

        this.playing && this.url && this.lyric.play();
      } catch (err) {
        console.log(err);
      }
    },
    async getComments(id) {
      try {
        const res = await getComments(id);

        const total = res.data.total;

        this.totalComments = total > 999 ? 999 : total;
      } catch (err) {
        console.log(err);
      }
    },
    handleLyric({lineNum, txt}) {
      this.currentLineNum = lineNum;

      if (lineNum > 5) {
        const line = this.$refs.line[lineNum - 5];
        this.$refs.lyricWrapper.scrollToElement(line, 1000);
      } else {
        this.$refs.lyricWrapper.scrollTo(0, 0, 1000);
      }

      this.playingLyric = txt;
    },
    toggleFavorite(song) {
      if (this.isFavorite) {
        this.deleteFavoriteList(song);
      } else {
        this.saveFavoriteList(song);
      }
    },
    togglePlaying() {
      this.setPlaying(!this.playing);
      this.lyric && this.lyric.togglePlay();
    },
    prev() {
      let index = this.currentIndex - 1;

      if (index === -1) {
        index = this.playlist.length - 1;
      }

      this.setCurrentIndex(index);
    },
    next() {
      let index = this.currentIndex + 1;

      if (index === this.playlist.length) {
        index = 0;
      }

      this.setCurrentIndex(index);
    },
    ended() {
      if (this.mode === mode.once) {
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
        this.lyric && this.lyric.seek(0);
      } else {
        this.next();
      }
    },
    ready() {
      this.lyric && this.lyric.play();
    },
    close() {
      if (location.hash.indexOf('full-screen') === -1) {
        this.showLyric = false;

        this.$nextTick(() => {
          this.setFullScreen(false);
        });
      }
    },
    back() {
      history.go(-1);
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

      this.lyric && this.lyric.seek(this.$refs.audio.currentTime * 1000);
    },
    changeMode() {
      const m = (this.mode + 1) % 3;
      this.setMode(m);

      this.$refs.toast.open(this.modeText);

      let list = this.sequenceList;

      if (m === mode.random) {
        list = shuffle(list);
      }

      const index = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });

      this.setCurrentIndex(index);
      this.setPlaylist(list);
    },
    openPlaylist() {
      this.$refs.playlist.open('playlist');
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
      const width = (innerWidth * 0.7) + 8;

      return {
        x: -(innerWidth / 2 - 40),
        y: innerHeight - 120 - width / 2 - 30,
        scale: 40 / width
      };
    }
  },
  watch: {
    async currentSong(newSong, oldSong) {
      if (newSong.id === oldSong.id) {
        return;
      }

      this.savePlayHistory(newSong);

      this.currentTime = 0;
      this.duration = 0;
      this.url = '';
      this.currentLineNum = 0;
      this.lyric && this.lyric.stop();

      if (!newSong.id) {
        return;
      }

      await Promise.all([
        this.getSong(newSong.id),
        this.getLyric(newSong.id)
      ]);

      this.setPlaying(true);

      this.getComments(newSong.id);

      const timer = setInterval(() => {
        if (this.duration) {
          clearInterval(timer);
          return;
        }
        this.duration = this.$refs.audio.duration;
      }, 300);
    },
    playing(val) {
      if (!this.url) { return; }

      this.$nextTick(() => {
        val ? this.$refs.audio.play() : this.$refs.audio.pause();
      });
    },
    fullScreen(val) {
      if (val) {
        history.pushState({ page: 'full-screen' }, 'full-screen', `${location.href}#full-screen`);
      }
    },
    showLyric(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.lyricWrapper.refresh();
        });
      }
    }
  },
  mounted() {
    addEventListener('popstate', this.close);
  }
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
        filter: blur(40px)
        transform: scale(1.5)
        background-size: cover
        &::after
          content: ''
          absolute: top 0 left 0 right 0 bottom 0
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
          margin: 0 50px

      .middle
        absolute: top 120px left 0 right 0 bottom 200px
        display: flex
        justify-content: center

        .cd-wrapper
          size: 70% 0
          padding-bottom: 70%
          border: 8px solid rgba(255, 255, 255, 0.2)
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

        .lyric-wrapper
          height: 100%
          text-align: center
          color: $color-text-g
          overflow: hidden

          .line
            line-height: 36px
            padding: 0 10px
            &.active
              color: $white

      .bottom
        absolute: bottom 30px left 0 right 0

        .top-btns
          display: flex
          padding: 0 20%
          justify-content: space-between
          align-items: center
          .favorite
            .icon
              color: $color-theme
          .icon
            color: rgba($white, 0.7)
            font-size: 22px
          .comment
            position: relative

            .icon
              font-size: 24px

            .count
              absolute: top 1px left 16px
              font-size: 10px
              color: rgba($white, 0.7)

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
          .mode
            .icon
              font-size: 26px
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
