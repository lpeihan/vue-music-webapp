<template>
  <transition name="popup">
    <div class="playlist" v-show="show">
      <div class="content"></div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      show: false
    };
  },
  methods: {
    open() {
      this.show = true;
    },
    close() {
      this.show = false;
    }
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
      &-enter
      &-leave-to
        opacity: 0

    .content
      absolute: bottom 0 left 0 right 0
      height: 300px
</style>
