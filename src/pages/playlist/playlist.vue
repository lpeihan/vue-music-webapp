<template>
  <transition name="popup">
    <div class="playlists" v-show="show" @click="back">
      <div class="content" :style="{ height: height + 'px' }" @click.stop>
        <div class="header">
          <div class="mode" @click="changeMode">
            <icon :name="modeName"></icon>
            <span class="text">{{modeText}} ( {{sequenceList.length}} )</span>
          </div>
          <div class="clear">
            <icon name="clear"></icon>
          </div>
        </div>

        <scroll class="list" :data="sequenceList" ref="scroll">
          <ul>
            <li class="item" v-for="(item, index) in sequenceList" :key="index"
              ref="item"
              @click="select(item, index)"
              :class="{'active': currentSong.id === item.id }">
              <span class="volume" v-show="currentSong.id === item.id"><icon name="volume"></icon></span>
              <span>{{item.name}}</span>
              <span class="desc">- {{item.desc}}</span>
              <div class="delete"><icon name="delete"></icon></div>
            </li>
          </ul>
        </scroll>
      </div>
    </div>
  </transition>
</template>

<script>
import { showMixin } from '../../utils/mixins';
import { mapGetters, mapMutations } from 'vuex';
import Scroll from '../../components/scroll';

export default {
  mixins: [
    showMixin
  ],
  components: {
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
    scrollToCurrent() {
      const index = this.sequenceList.findIndex(item => {
        return item.id === this.currentSong.id;
      });

      this.$refs.scroll.scrollToElement(this.$refs.item[index], 300);
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
          .icon
            font-size: $font-size-medium

        .desc
          font-size: $font-size-small
          color: $color-text-l
        .delete
          absolute: top 50% right 5px
          transform: translateY(-50%)
          .icon
            color: $color-text-l
</style>
