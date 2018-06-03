<template>
  <transition>
    <div class="confirm" v-if="show" @click.stop="back">
      <div class="confirm-content" @click.stop>
        <div class="main">
          <h1 class="text">{{text}}</h1>
        </div>
        <div class="footer">
          <div class="cancel-btn" @click.stop="cancel">取消</div>
          <div class="confirm-btn" @click.stop="confirm">清空</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { showMixin } from '../utils/mixins';

export default {
  mixins: [
    showMixin
  ],
  props: {
    text: {
      type: String,
      default: '是否清空播放列表？'
    }
  },
  methods: {
    cancel() {
      this.back();
      this.$emit('cancel');
    },
    confirm() {
      this.back();
      this.$emit('confirm');
    }
  }
};
</script>

<style lang="stylus" scoped>
  @import "../styles/variables"
  @import "../styles/mixins"

  .confirm
    fixed: top 0 left 0 right 0 bottom 0
    z-index: 3000
    background: $color-overlay

    &.v
      &-enter-active
      &-leave-active
        transition: all .4s
        .confirm-content
          transition: all .4s
      &-enter
      &-leave-to
        opacity: 0
        .confirm-content
          transform: translate(-50%, -50%) scale(0)

    .confirm-content
      absolute: top 50% left 50%
      width: 80%
      border-radius: 5px
      transform: translate(-50%, -50%) scale(1)
      background: $color-background
      font-size: $font-size-medium
      .main
        padding: 30px
        text-align: center
        .text
          color: $color-text-l
          line-height: 25px
      .footer
        height: h = 44px
        display: flex
        color: $color-theme
        text-align: center
        .cancel-btn
          flex: 1
          line-height: h
        .confirm-btn
          flex: 1
          line-height: h
</style>
