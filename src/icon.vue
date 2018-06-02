<template>
  <i class="icon" v-html="icons[name]">
  </i>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      icons: {
        back: require('./assets/icons/back.svg'),
        menu: require('./assets/icons/menu.svg'),
        search: require('./assets/icons/search.svg'),
        logo: require('./assets/icons/logo.svg'),
        rank: require('./assets/icons/rank.svg'),
        calendar: require('./assets/icons/calendar.svg'),
        fm: require('./assets/icons/fm.svg'),
        disc: require('./assets/icons/disc.svg'),
        down: require('./assets/icons/down.svg'),
        play: require('./assets/icons/play.svg'),
        next: require('./assets/icons/next.svg'),
        prev: require('./assets/icons/prev.svg'),
        playlist: require('./assets/icons/playlist.svg'),
        random: require('./assets/icons/random.svg'),
        pause: require('./assets/icons/pause.svg'),
        minipause: require('./assets/icons/mini-pause.svg'),
        miniplay: require('./assets/icons/mini-play.svg'),
        headphones: require('./assets/icons/headphones.svg'),
        more: require('./assets/icons/more.svg')
      }
    };
  }
};
</script>

<style lang="stylus">
  @import "./styles/variables"
  @import "./styles/mixins"

  .icon
    display: inline-block
    font-size: $font-size-large-x

    svg
      size: 1em
      fill: currentColor
</style>
