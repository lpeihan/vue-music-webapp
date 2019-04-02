<template>
  <ul class="entry">
    <li class="item" v-for="(entry, index) in entries" :key="index">
      <div class="circle">
        <icon :name="entry.icon" class="icons"></icon>
      </div>
      <p class="text">{{entry.text}}</p>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      entries: [
        {
          text: '私人fm',
          icon: 'fm'
        },
        {
          text: '每日推荐',
          icon: 'calendar'
        },
        {
          text: '歌单',
          icon: 'disc'
        },
        {
          text: '排行榜',
          icon: 'rank'
        }
      ]
    };
  }
};
</script>

<style lang="stylus">
  @import "../../styles/variables"
  @import "../../styles/mixins"

  .entry
    display: flex
    padding: 15px 0
    border-1px($color-border)

    .item
      flex: 1
      font-size: $font-size-medium
      text-align: center
      .circle
        position: relative
        display: inline-block
        width: 45%
        padding-bottom: 45%
        border: 1px solid $color-theme
        border-radius: 50%
        height: 0

        .icons
          color: $color-theme
          absolute: top 50% left 50%
          transform: translate(-50%, -50%)
      .text
        margin-top: 8px
</style>
