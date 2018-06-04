<template>
  <div class="song-list">
    <div class="song" v-for="(song, index) in songs" :key="index" @click="select(song, index)">
      <div class="number">{{index + 1}}</div>
      <p class="name">{{song.name}}</p>
      <p class="singer">{{song.singer}} - {{song.desc}}</p>
      <div class="more"><icon name="more"></icon></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    select(song, index) {
      this.$emit('select', song, index);
    }
  }
};
</script>

<style lang="stylus" scoped>
  @import "../../styles/variables"
  @import "../../styles/mixins"

  .song-list
    position: relative
    border-radius: 12px
    background: $color-background

    .song
      padding: 16px 30px 16px 0
      margin-left: 56px
      position: relative
      border-1px($color-border)

      .number
        absolute: top 27px left -34px
        color: $color-text-l

      .name
        color: $color-text
        no-wrap()

      .singer
        margin-top: 8px
        color: $color-text-l
        font-size: $font-size-small
        no-wrap()

      .more
        absolute: top 22px right 15px
        color: $color-text-l
</style>
