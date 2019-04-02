<template>
  <div class="swiper"
    @touchstart.stop="handleTouchstart"
    @touchmove.stop="handleTouchmove"
    @touchend.stop="handleTouchend"
  >
    <div
      ref="wrap"
      class="swiper-wrap"
      :style="{
        'transform': `translate3d(${translateX - (index * width)}px, 0, 0)`,
        'transition': `transform ${duration}ms`
      }"
    >
      <slot></slot>
    </div>

    <div class="dots">
      <span class="dot" v-for="i in length" :key="i" :class="{ 'active': index === i }"></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    interval: {
      type: Number,
      default: 3000
    }
  },
  data() {
    return {
      index: 1,
      width: 0,
      length: 0,
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      translateX: 0,
      timer: null,
      duration: 0
    };
  },
  methods: {
    prev() {
      this.index--;
    },
    next() {
      this.index++;
    },
    getAngle(startX, startY, endX, endY) {
      return 360 * Math.atan((endY - startY) / (endX - startX)) / (2 * Math.PI);
    },
    loop() {
      const el = this.$refs.wrap;
      const first = el.firstChild.cloneNode(true);
      const last = el.lastChild.cloneNode(true);
      el.appendChild(first);
      el.insertBefore(last, el.firstChild);
    },
    handleTouchstart(e) {
      this.startX = e.touches[0].pageX;
      this.startY = e.touches[0].pageY;
      this.endX = e.touches[0].pageX;
      this.endY = e.touches[0].pageY;
    },
    handleTouchmove(e) {
      if (this.duration) {
        return;
      }
      clearInterval(this.timer);

      this.endX = e.touches[0].pageX;
      this.endY = e.touches[0].pageY;
      const dx = this.endX - this.startX;
      const angle = this.getAngle(this.startX, this.startY, this.endX, this.endY);

      if (Math.abs(dx) > 6 && Math.abs(angle) < 20) {
        this.translateX = dx > 0 ? Math.min(dx, this.width) : Math.max(dx, -this.width);
      }
    },
    handleTouchend(e) {
      if (this.duration) {
        return;
      }
      const percent = (this.endX - this.startX) / this.width;
      this.translateX = 0;
      this.autoPlay();

      if (percent < -0.3) {
        this.next();
      } else if (percent > 0.3) {
        this.prev();
      }

      this.slider();
    },
    slider() {
      this.duration = 300;
      setTimeout(() => {
        this.duration = 0;

        if (this.index >= this.length + 1) {
          this.index = 1;
        }

        if (this.index <= 0) {
          this.index = this.length;
        }
      }, this.duration);
    },
    autoPlay() {
      this.timer = setInterval(() => {
        this.next();
        this.slider();
      }, this.interval);
    }
  },
  mounted() {
    this.width = this.$el.clientWidth;
    this.length = this.$refs.wrap.children.length;
    this.loop();
    this.autoPlay();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>

<style lang="stylus" scoped>
  @import "../styles/variables"
  @import "../styles/mixins"

  .swiper
    position: relative
    overflow: hidden

    .swiper-wrap
      font-size: 0
      white-space: nowrap
      height: 100%

      & > div
        size: 100%
        display: inline-block
        font-size: $font-size-default

    .dots
      absolute: left 0 right 0 bottom 12px
      text-align: center

      .dot
        display: inline-block
        size: 6px
        margin: 0 4px
        background: $white
        border-radius: 50%
        transition: background .3s

        &.active
          background: $color-theme
</style>
