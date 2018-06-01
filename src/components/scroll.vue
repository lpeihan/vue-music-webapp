<template>
  <div class="scroll">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll';

export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    data: {
      type: Array,
      default: () => []
    },
    bounceTop: {
      type: Boolean,
      default: true
    },
    loaded: {
      type: Boolean,
      default: true
    },
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null
    };
  },
  methods: {
    initScroll() {
      this.scroll = new BScroll(this.$el, {
        probeType: this.probeType,
        click: true,
        bounce: {
          top: this.bounceTop
        }
      });

      if (this.listenScroll) {
        const that = this;
        this.scroll.on('scroll', (pos) => {
          that.$emit('scroll', pos);
        });
      }
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh();
      }, 20);
    },
    loaded() {
      setTimeout(() => {
        this.refresh();
      }, 20);
    }
  },
  mounted() {
    setTimeout(() => {
      this.initScroll();
    });
  }
};
</script>

<style lang="stylus" scoped>
  .scroll
    height: 100%
</style>
