<template>
  <transition>
    <div class="comments">
      <div class="header">
        <div class="back" @click="$router.go(-1)"><icon name="back"></icon></div>
        <div class="text">
          <span>评论</span>
          <span>({{total}})</span>
        </div>
      </div>
      <scroll class="comments-content" :data="comments"
        :probe-type="3"
        :listen-scroll="true"
        @scroll="onScroll"
      >
        <div>
          <div class="preview">
            <img :src="currentSong.image" alt="" width="64" class="img">
            <div class="text">
              <p class="name">{{currentSong.name}}</p>
              <p class="singer">{{currentSong.singer}}</p>
            </div>
          </div>

          <div class="comments-wrapper">
            <div class="title">精彩评论</div>
            <comment-item v-for="hot in hotComments" :comment="hot" :key="hot.commentId"></comment-item>

            <div class="title">最新评论</div>
            <comment-item v-for="comment in comments" :comment="comment" :key="comment.commentId"></comment-item>

            <div class="loading-wrapper">
              <loading v-show="loading && comments.length"></loading>
            </div>
          </div>
        </div>
      </scroll>

    </div>
  </transition>
</template>

<script>
import { getComments } from '../../api/song';
import { mapGetters } from 'vuex';
import CommentItem from './comment-item';
import Scroll from '../../components/scroll';
import Loading from '../../components/loading';

export default {
  components: {
    CommentItem,
    Scroll,
    Loading
  },
  data() {
    return {
      total: 0,
      comments: [],
      hotComments: [],
      loading: false
    };
  },
  computed: {
    ...mapGetters(['currentSong'])
  },
  methods: {
    async getComments(id) {
      try {
        const res = await getComments(id);

        const { total, comments, hotComments } = res.data;

        this.total = total;
        this.comments = comments;
        this.hotComments = hotComments;
      } catch (err) {
        console.log(err);
      }
    },
    async getMoreComments(id) {
      try {
        this.loading = true;
        const res = await getComments(id, this.comments.length);

        setTimeout(() => {
          this.comments = this.comments.concat(res.data.comments);
          this.loading = false;
        }, 1000);
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    onScroll(pos, maxScrollY) {
      if (pos.y <= maxScrollY && !this.loading) {
        this.getMoreComments(this.$route.params.id);
      }
    }
  },
  created() {
    this.getComments(this.$route.params.id);
  }
};
</script>

<style lang="stylus">
  @import "../../styles/variables"
  @import "../../styles/mixins"

  .comments
    fixed: top 0 left 0 right 0 bottom 0
    background: $color-background
    z-index: 4000

    &.v
      &-enter-active
      &-leave-active
        transition: all .4s
      &-enter
      &-leave-to
        transform: translate3d(100%, 0, 0)

    .header
      height: 50px
      display: flex
      align-items: center
      color: $white
      background: $color-theme
      padding: 0 10px
      .icon
        font-size: 28px
      .text
        font-size: $font-size-large
        margin-left: 15px
    .preview
      display: flex
      align-items: center
      padding: 10px
      overflow: hidden

      .img
        border-radius: 5px
      .text
        flex: 1
        padding-left: 10px
        .singer
          margin-top: 10px
          color: $color-primary
          font-size: $font-size-medium

    .comments-wrapper
      .title
        line-height: 24px
        padding: 0 10px
        font-size: $font-size-small
        color: $color-text-l
        background: rgba(7, 17, 27, .1)

    .comments-content
      height: calc(100% - 50px)
      overflow hidden
      .loading-wrapper
        height: 60px
        display: flex
        justify-content: center
        align-items: center
</style>
