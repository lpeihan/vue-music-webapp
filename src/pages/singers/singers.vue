<template>
  <scroll class="singers" :data="singers" ref="scroll">
    <ul>
      <li class="singer" v-for="(singer, index) in singers" :key="index">
        {{singer.name}}
      </li>
    </ul>
    <div class="loading-wrapper">
      <loading v-show="!singers.length && tabIndex === 2"></loading>
    </div>
  </scroll>
</template>

<script>
import { getSingers } from '../../api/singers';
import { mapGetters } from 'vuex';
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
      singers: []
    };
  },
  computed: {
    ...mapGetters(['tabIndex'])
  },
  methods: {
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
    tabIndex() {
      if (this.tabIndex === 2 && !this.singers.length) {
        this.getSingers();
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
  @import "../../styles/variables"
  @import "../../styles/mixins"

  .singers
    height: 100%
    position: relative

    .loading-wrapper
      absolute: top 50% left 50%
      transform: translate3d(-50%, -50%, 0)
</style>
