<template>
  <div class="recommends">
    <scroll class="recommends-scroll" :loaded="loaded" :bounce-top="false">
      <div>
        <div class="barnners-wrapper" v-if="barnners.length">
          <swiper :interval="4000" class="barnners">
            <div
              v-for="(barnner, index) in barnners"
              :key="index"
            >
              <img :src="barnner.picUrl" width="100%">
            </div>
          </swiper>
        </div>
        <entry v-show="loaded"></entry>

        <div class="recommend-list" v-show="loaded">
          <h1 class="title">
            <span>推荐歌单</span>
          </h1>

          <div
            class="recommend-item"
            v-for="(recommend, index) in recommends"
            :key="index"
            @click="selectRecommend(recommend)"
          >
            <div class="inner">
              <img v-lazy="recommend.picUrl" class="img">
            </div>
            <div class="name">
              {{recommend.name}}
            </div>
          </div>
        </div>
      </div>
      <div class="loading-wrapper" v-show="!loaded">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Swiper from '../../components/swiper';
import Entry from '../entry/entry';
import Scroll from '../../components/scroll';
import Loading from '../../components/loading';

import { getBanners, getRecommends } from '../../api/recommends';
import { mapMutations } from 'vuex';

export default {
  components: {
    Swiper,
    Entry,
    Scroll,
    Loading
  },
  data() {
    return {
      barnners: [],
      recommends: [],
      loaded: false
    };
  },
  methods: {
    ...mapMutations({
      setMusicList: 'SET_MUSIC_LIST'
    }),
    async getBanners() {
      try {
        const res = await getBanners();

        if (res.status === 200) {
          this.barnners = res.data.banners;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getRecommends() {
      try {
        const res = await getRecommends();

        if (res.status === 200) {
          this.recommends = res.data.result;
        }
      } catch (err) {
        console.log(err);
      }
    },
    selectRecommend(recommend) {
      this.$router.push(`/recommends/${recommend.id}`);

      this.setMusicList(recommend);
    }
  },
  async created() {
    await this.getBanners();
    await this.getRecommends();

    this.loaded = true;
  }
};
</script>

<style lang="stylus" scoped>
  @import "../../styles/variables"
  @import "../../styles/mixins"

  .recommends
    height: 100%
    position: relative

    .barnners-wrapper
      position: relative
      padding: 0 8px

      &::after
        content: ''
        absolute: top 0 left 0 right 0 bottom 20%
        background: $color-theme
        z-index: -1

      .barnners
        border-radius: 6px

    .recommend-list
      overflow: hidden

      .title
        font-weight: 700
        line-height: 50px
        padding: 0 8px

      .recommend-item
        width: calc(33.33% - 11px)
        float: left
        margin-left: 8px
        overflow: hidden

        .inner
          width: 100%
          padding-bottom: 100%
          position: relative
          height: 0
          .img
            border-radius: 5px
            absolute: top 0 left 0 right 0 bottom 0
            size: 100%

        .name
          overflow: hidden
          margin: 6px 0 12px
          height: 36px
          line-height: 18px
          white-space: normal
          font-size: $font-size-small

    .loading-wrapper
      absolute: top 50% left 50%
      transform: translate3d(-50%, -50%, 0)

</style>
