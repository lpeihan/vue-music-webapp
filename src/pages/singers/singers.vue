<template>
  <scroll
    class="singers" ref="scroll"
    :data="singers" :bounce-top="false" :listen-scroll="true" :probe-type="3"
    @scroll="scroll"
  >
    <ul class="groups">
      <li class="group" v-for="(group, index) in singers" :key="index" ref="group">
        <ul class="items">
          <h1 class="title">{{group.title}}</h1>
          <li
            v-for="(item, index) in group.items" :key="index"
            class="item"
            @click="selectSinger(item, index)"
          >
            <img v-lazy="item.avatar" alt="avatar" width="40" height="40" class="avatar">
            <p class="name">{{item.name}}</p>
          </li>
        </ul>
      </li>
    </ul>
    <ul
      class="shortcuts"
      @touchstart.stop="handleTouchstart"
      @touchmove.stop="handleTouchmove"
    >
      <li v-for="(group, index) in singers" :key="group.title"
        :class="{ 'active': index === currentIndex }"
        :data-index="index"

      >
        {{group.title[0]}}
      </li>
    </ul>
    <div class="loading-wrapper">
      <loading v-show="!singers.length && tabIndex === 2"></loading>
    </div>
  </scroll>
</template>

<script>
import { getSingers } from '../../api/singers';
import { mapGetters, mapMutations } from 'vuex';
import Scroll from '../../components/scroll';
import Loading from '../../components/loading';
import pinyin from 'pinyin';

export default {
  components: {
    Scroll,
    Loading
  },
  data() {
    return {
      singers: [],
      currentIndex: 0,
      listHeight: [],
      startY: 0
    };
  },
  computed: {
    ...mapGetters(['tabIndex'])
  },
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    selectSinger(singer, index) {
      this.setSinger(singer);

      this.$router.push(`/singers/${singer.id}`);
    },
    scroll(pos) {
      const list = this.listHeight;

      if (pos.y >= 0) {
        this.currentIndex = 0;
        return;
      }

      for (let i = 0; i < list.length - 1; i++) {
        let h1 = list[i];
        let h2 = list[i + 1];

        if (-pos.y >= h1 && -pos.y < h2) {
          this.currentIndex = i;
        }
      }
    },
    async getSingers() {
      try {
        const singers = (await getSingers()).data.artists;

        singers.forEach((singer) => {
          let py = pinyin(singer.name[0], { style: pinyin.STYLE_FIRST_LETTER });

          singer.findex = py[0][0].toUpperCase();
        });
        this.singers = this.nomalizeSingers(singers);
      } catch (err) {
        console.log(err);
      }
    },
    handleTouchstart(e) {
      this.index = parseInt(e.target.getAttribute('data-index'), 10);
      this.startY = e.touches[0].pageY;

      this.$refs.scroll.scrollToElement(this.$refs.group[this.index], 150);
    },
    handleTouchmove(e) {
      const endY = e.touches[0].pageY;
      const deltaIndex = (endY - this.startY) / 16 | 0;

      const index = this.index + deltaIndex;
      this.$refs.scroll.scrollToElement(this.$refs.group[index], 150);
    },
    calculateHeight() {
      const groupList = this.$refs.group;
      let height = 0;

      this.listHeight.push(height);

      groupList.forEach((item, idnex) => {
        height += item.clientHeight;

        this.listHeight.push(height);
      });
    },
    nomalizeSingers(singers) {
      const groups = {};
      const hot = { title: '热门', items: [] };

      singers.forEach((singer, index) => {
        const item = {
          id: singer.id,
          name: singer.name,
          avatar: singer.img1v1Url,
          alias: singer.alias[0]
        };

        index < 10 && hot.items.push(item);

        const findex = singer.findex;

        if (!groups[findex]) {
          groups[findex] = { title: findex, items: [] };
        }

        groups[findex].items.push(item);
      });

      const ret = [];

      for (let key in groups) {
        if (/[A-Z]/.test(key)) {
          ret.push(groups[key]);
        }
      }

      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });

      return [hot].concat(ret);
    }
  },
  watch: {
    async tabIndex() {
      if (this.tabIndex === 2 && !this.singers.length) {
        await this.getSingers();

        this.$nextTick(() => {
          this.calculateHeight();
        });
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
  @import "../../styles/variables"
  @import "../../styles/mixins"

  .singers
    position: relative

    .groups
      padding: 0

      .group:first-child
        .title
          padding-left: 16px

      .title
        padding: 0 24px
        line-height: 24px
        color: $white
        font-size: $font-size-medium
        background: rgba(0, 0, 0, .1)

      .item
        padding: 0 10px
        display: flex
        height: 60px
        align-items: center
        .avatar
          border-radius: 50%
        .name
          margin-left: 10px
          font-size: 15px

    .shortcuts
      absolute: top 0 right 8px
      padding: 14% 0 18%
      width: 30px
      text-align: center
      display: flex
      flex-direction: column
      justify-content: space-between
      height: 100%
      box-sizing: border-box

      li
        font-family: Helvetica
        color: $color-text-l
        font-size: $font-size-small
        padding: 2px 0
        &.active
          color: $color-theme

    .loading-wrapper
      absolute: top 50% left 50%
      transform: translate3d(-50%, -50%, 0)

</style>
