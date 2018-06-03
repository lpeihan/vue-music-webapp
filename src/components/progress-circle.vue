<template>
  <div class="progress-circle">
    <canvas :width="w" :height="w" ref="canvas"></canvas>
  </div>
</template>

<script>
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    },
    w: {
      type: Number,
      default: 36
    },
    color: {
      type: String
    }
  },
  data() {
    return {
      ctx: {}
    };
  },
  mounted() {
    const canvas = this.$refs.canvas;
    const ctx = canvas.getContext('2d');
    const r = this.w / 2;
    this.ctx = ctx;
    ctx.translate(0.5, 0.5);

    ctx.beginPath();

    ctx.arc(r, r, r - 2, 0, 2 * Math.PI, false);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#757575';
    ctx.stroke();
  }
};
</script>

<style lang="stylus" scoped>
  .progress-circle
    padding: 20px
</style>
