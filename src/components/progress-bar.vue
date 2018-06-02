<template>
  <div class="progress-bar" @click="clickProress">
    <div class="bar">
      <div
        class="progress"
        :style="{ width: translateX + 'px'}">
      </div>
      <div
        class="btn-wrapper"
        :style="{ transform: `translateX(${translateX}px)` }"
        @touchstart="handleTouchstart"
        @touchmove="handleTouchmove"
        @touchend="handleTouchend"
      >
        <div class="btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      startTranslateX: 0,
      startX: 0,
      touching: false,
      translateX: 0
    };
  },
  methods: {
    getPageX(e) {
      return e.changedTouches ? e.changedTouches[0].pageX : e.pageX;
    },
    handleTouchstart(e) {
      this.touching = true;
      this.startX = this.getPageX(e);
    },
    handleTouchmove(e) {
      const deltaX = this.getPageX(e) - this.startX;
      let translateX = this.startTranslateX + deltaX;
      translateX = translateX < 0 ? 0 : translateX;
      translateX = Math.min(translateX, this.$el.clientWidth);
      this.translateX = translateX;
    },
    handleTouchend() {
      this.touching = false;
      this.$emit('update', (this.translateX) / this.$el.clientWidth);
    },
    clickProress(e) {
      this.$emit('update', (e.offsetX) / this.$el.clientWidth);
    }
  },
  watch: {
    percent() {
      if (!this.touching) {
        this.startTranslateX = this.percent * this.$el.clientWidth;
        this.translateX = this.startTranslateX;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
  @import "../styles/variables"
  @import "../styles/mixins"

  .progress-bar
    height: 30px
    .bar
      relative: top 13px
      height: 3px
      border-radius: 5px
      background: rgba(0, 0, 0, 0.3)
      .progress
        height: 100%
        position: absolute
        background: $color-theme
      .btn-wrapper
        absolute: top -13px left -15px
        box-sizing: border-box
        size: 30px
        padding: 9px
        .btn
          position: relative
          size: 12px
          box-sizing: border-box
          border: 4px solid $white
          background: $color-theme
          border-radius: 50%

</style>
