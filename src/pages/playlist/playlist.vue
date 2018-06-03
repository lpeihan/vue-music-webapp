<template>
  <transition name="popup">
    <div class="playlists" v-show="show" @click="back">
      <div class="content" :style="{ height: height + 'px' }" @click.stop>
        <div class="header">
          <div class="mode" @click="changeMode">
            <icon :name="modeName"></icon>
            <span class="text">{{modeText}} ({{sequenceList.length}})</span>
          </div>
          <div class="clear" @click="openConfirm">
            <icon name="clear"></icon>
          </div>
        </div>

        <scroll class="list" :data="playlist" ref="scroll">
          <ul>
            <li class="item" v-for="(item, index) in sequenceList" :key="index"
              ref="item"
              @click="select(item, index)"
              :class="{'active': currentSong.id === item.id }">
              <span class="volume" v-show="currentSong.id === item.id"><icon name="volume"></icon></span>
              <span>{{item.name}}</span>
              <span class="desc">- {{item.desc}}</span>
              <div class="delete" @click.stop="deleteItem(item, index)"><icon name="delete"></icon></div>
            </li>
          </ul>
        </scroll>
      </div>
      <confirm ref="confirm" @confirm="clear"></confirm>
    </div>
  </transition>
</template>

<script>
import { showMixin } from '../../utils/mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import Scroll from '../../components/scroll';
import Confirm from '../../components/confirm';

export default {
  mixins: [
    showMixin
  ],
  components: {
    Confirm,
    Scroll
  },
  props: {
    modeName: String
  },
  computed: {
    ...mapGetters(['sequenceList', 'playlist', 'currentSong']),
    modeText() {
      return this.modeName === 'loop' ? '循环播放' : this.modeName === 'random' ? '随机播放' : '单曲循环';
    }
  },
  data() {
    return {
      height: 0
    };
  },
  methods: {
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX'
    }),
    ...mapActions(['deleteSong', 'clearPlaylist']),
    changeMode() {
      this.$emit('changeMode');
    },
    select(item, index) {
      if (this.modeName === 'random') {
        index = this.playlist.findIndex((song) => {
          return song.id === item.id;
        });
      }
      this.setCurrentIndex(index);
      this.back();
    },
    deleteItem(song, index) {
      this.deleteSong({ song, index });
    },
    openConfirm() {
      this.$refs.confirm.open('confirm');
    },
    clear() {
      this.clearPlaylist();
      this.back();
      if (location.hash.indexOf('#full-screen') > -1) {
        this.back();
      }
    },
    scrollToCurrent() {
      const index = this.sequenceList.findIndex(item => {
        return item.id === this.currentSong.id;
      });

      if (index >= 2) {
        this.$refs.scroll.scrollToElement(this.$refs.item[index - 2], 300);
      }
    }
  },
  mounted() {
    this.height = innerHeight * 0.65;
  },
  watch: {
    show(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
          this.scrollToCurrent();
        });
      }
    }
  }
};
</script>

<style lang="stylus">
  @import "../../styles/variables"
  @import "../../styles/mixins"

  .playlists
    fixed: top 0 left 0 right 0 bottom 0
    background: $color-overlay
    z-index: 2000

    &.popup
      &-enter-active
      &-leave-active
        transition: all .5s
        .content
          transition: all .5s

      &-enter
      &-leave-to
        opacity: 0
        .content
          transform: translate3d(0, 100%, 0)

    .content
      absolute: bottom 0 left 0 right 0
      background: $color-background
      border-top-left-radius: 15px
      border-top-right-radius: 15px
      font-size: $font-size-medium + 1

      .header
        height: 50px
        display: flex
        align-items: center
        padding: 0 15px 0 10px
        justify-content: space-between
        border-1px($color-border)

        .mode, .clear
          .icon
            color: $color-text-l
            font-size: 20px
        .text
          relative: top -4px left 2px

      .list
        padding: 0 10px
        height: calc(100% - 50px)
        overflow: hidden
        .item
          position: relative
          padding: 20px 30px 20px 0
          border-1px($color-border)
          &.active
            color: $color-theme

        .volume
          relative: top 2px
          .icon
            font-size: $font-size-medium + 1

        .desc
          font-size: $font-size-small
          color: $color-text-l
        .delete
          absolute: top 50% right 0
          transform: translateY(-50%)
          padding: 5px
          .icon
            color: rgba($color-text-l, .6)
</style>
