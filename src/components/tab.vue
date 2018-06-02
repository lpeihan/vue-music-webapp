<template>
  <div class="tab">
    <div class="tab-titles">
      <div class="title" v-for="(tab, i) in tabs" :key="i" @click="go(i)">
        <span :class="{ 'active': i === index }">{{tab}}</span>
      </div>
      <div
        class="scroll-bar"
        :style="{
          'width': (100 / tabs.length) + '%',
          'transition-duration': touching ? '0ms' : '400ms',
          'transform': `translate3d(${((index - translateX / width) / tabs.length) * width}px, 0, 0)`
        }"
      ></div>
    </div>
    <div
      class="tab-content"
      @touchstart="handleTouchstart"
      @touchmove="handleTouchmove"
      @touchend="handleTouchend"
    >
      <div
        ref="wrap"
        class="tab-content-wrap"
        :style="{ 'transform': `translate3d(${translateX - (index * width)}px, 0, 0)` }"
        :class="{ 'transition': !touching }"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    tabs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      width: 0,
      index: 0,
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      translateX: 0,
      touching: false
    };
  },
  methods: {
    go(index) {
      this.index = index;
    },
    getAngle(startX, startY, endX, endY) {
      return 360 * Math.atan((endY - startY) / (endX - startX)) / (2 * Math.PI);
    },
    handleTouchstart(e) {
      this.touching = true;
      this.startX = e.touches[0].pageX;
      this.startY = e.touches[0].pageY;
    },
    handleTouchmove(e) {
      this.endX = e.touches[0].pageX;
      this.endY = e.touches[0].pageY;
      const dx = this.endX - this.startX;
      const angle = this.getAngle(this.startX, this.startY, this.endX, this.endY);

      if ((dx < 0 && this.index >= this.tabs.length - 1) || (dx > 0 && this.index === 0)) {
        return;
      }

      if (Math.abs(dx) > 6 && Math.abs(angle) < 20) {
        this.translateX = dx > 0 ? Math.min(dx, this.width) : Math.max(dx, -this.width);
      }
    },
    handleTouchend(e) {
      const percent = (this.endX - this.startX) / this.width;
      this.touching = false;
      this.translateX = 0;

      if (percent < -0.3 && this.index < this.tabs.length - 1) {
        this.index++;
      } else if (percent > 0.3 && this.index > 0) {
        this.index--;
      }
    }
  },
  mounted() {
    this.width = this.$refs.wrap.clientWidth;
  }
};
</script>

<style lang="stylus" scoped>
  @import "../styles/variables"
  @import "../styles/mixins"

  .tab

    &-titles
      position: relative
      display: flex
      height: h = 50px
      text-align: center
      color: $white
      background: $color-theme
      .title
        flex: 1
        line-height: h
        color: rgba($white, .7)
      .active
        color: $white
      .scroll-bar
        absolute: bottom 8px
        height: 2px
        transition: all .4s
        &::after
          content: ''
          absolute: top 0 left 50% bottom 0
          transform: translateX(-50%)
          background: $white
          width: 30%
          border-radius: 10px

    &-content
      overflow: hidden
      height: calc(100% - 50px)

      &-wrap
        height: 100%
        font-size: 0
        white-space: nowrap

        &.transition
          transition: transform .5s

        & > div
          display: inline-block
          vertical-align: top
          size: 100%
          font-size: $font-size-medium-x
</style>
