<template>
  <transition name="popup">
    <div class="playlist" v-show="show" @click="back">
      <div class="content" :style="{ height: height + 'px' }"></div>
    </div>
  </transition>
</template>

<script>
import { showMixin } from '../../utils/mixins';

export default {
  data() {
    return {
      height: 0
    };
  },
  mixins: [
    showMixin
  ],
  mounted() {
    this.height = innerHeight / 2;
  }
};
</script>

<style lang="stylus" scoped>
  @import "../../styles/variables"
  @import "../../styles/mixins"

  .playlist
    fixed: top 0 left 0 right 0 bottom 0
    background: $color-overlay
    z-index: 2000

    &.popup
      &-enter-active
      &-leave-active
        transition: all .4s
        .content
          transition: all .4s

      &-enter
      &-leave-to
        opacity: 0
        .content
          transform: translate3d(0, 100%, 0)

    .content
      absolute: bottom 0 left 0 right 0
      background: $color-background
</style>
