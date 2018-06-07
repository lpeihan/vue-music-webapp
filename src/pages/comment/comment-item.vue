<template>
  <div class="comment-item">
    <div class="comment-item-header">
      <img :src="comment.user.avatarUrl" alt="avatar" class="avatar">
      <div class="info">
        <p class="nickname">{{comment.user.nickname}}</p>
        <p class="time">{{comment.time | date}}</p>
      </div>
      <div class="like">
        <span class="count">{{comment.likedCount}}</span>
        <icon name="like"></icon>
      </div>
    </div>
    <div class="comment-item-content">
      {{comment.content}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    comment: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style lang="stylus">
  @import "../../styles/variables"
  @import "../../styles/mixins"

  .comment-item
    border-1px($color-border, 56px)
    &-header
      padding: 10px
      height: 36px
      display: flex
      align-items: center
      position: relative
      .avatar
        border-radius: 50%
        size: 36px
      .info
        padding-left: 10px
        flex: 1
        .nickname
          line-height: 20px
          color: $color-text-l
          font-size: $font-size-medium
        .time
          line-height: 16px
          font-size: $font-size-small - 2
          color: rgba(7, 17, 27, 0.5)
      .like
        display: flex
        absolute: right 10px
        align-items: center
        color: rgba(7, 17, 27, 0.5)
        font-size: $font-size-small
        .count
          margin-right: 5px
        .icon
          font-size: 22px
    &-content
      padding: 0 15px 15px 56px
      font-size: $font-size-medium
      line-height: 22px
</style>