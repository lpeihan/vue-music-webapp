<template>
  <div class="progress-circle">
    <svg
      :width="radius"
      :height="radius"
      viewBox="0 0 100 100"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"></circle>
      <circle
        class="progress-bar"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="dashOffset"
      ></circle>
    </svg>
    <div class="circle-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    radius: {
      type: Number,
      default: 32
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dashArray: Math.PI * 100
    };
  },
  computed: {
    dashOffset() {
      return Math.max((1 - this.percent), 0) * this.dashArray;
    }
  }
};
</script>

<style scoped lang="stylus">
@import "../styles/variables"
@import "../styles/mixins"

.progress-circle
  position: relative
  display: inline-block

  circle
    stroke-width: 4px
    transform-origin: center

    &.progress-background
      transform: scale(0.9)
      stroke: #999

    &.progress-bar
      transform: scale(0.9) rotate(-90deg)
      stroke: $color-theme

  .circle-content
    absolute: top left right bottom
    display: flex
    justify-content: center
    align-items: center
    color: white
    font-size: 12px
</style>
