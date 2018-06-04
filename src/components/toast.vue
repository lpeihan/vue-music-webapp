<template>
  <transition>
    <div class="toast" v-if="show">
      {{text}}
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      text: '',
      show: false,
      timer: null
    };
  },
  methods: {
    open(text, duration = 3000) {
      this.show = true;
      this.text = text;
      clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        this.show = false;
      }, duration);
    }
  }
};
</script>

<style lang="stylus" scoped>
  @import "../styles/variables"
  @import "../styles/mixins"

  .toast
    fixed: bottom 100px left 50%
    padding: 12px
    transform: translateX(-50%)
    background: rgba(#333, .8)
    border-radius: 8px
    color: $white
    z-index: 3000
    font-size: $font-size-medium
    &.v
      &-enter-active
      &-leave-active
        transition: all .3s
      &-enter
      &-leave-to
        transform: translate(-50%, 30px)
</style>
