<template>
  <scroll class="top-list" ref="scroll" :data="tops">
    <ul class="tops">
      <li class="top-item" v-for="(top, index) in tops" :key="index" @click="selectTopList(top)">
        <div class="left">
          <img v-lazy="top.coverImgUrl" alt="coverImgUrl" class="img">
        </div>
        <div class="right">
          <ul class="song-list">
            <li class="song-item" v-for="(song, index) in top.tracks" :key="index">
              {{`${index + 1}. ${song.first} - ${song.second}`}}
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <div class="loading-wrapper">
      <loading v-show="!tops.length && tabIndex === 1"></loading>
    </div>
  </scroll>
</template>

<script>
import { getTopList } from '../../api/top-list';
import { mapGetters, mapMutations } from 'vuex';
import Scroll from '../../components/scroll';
import Loading from '../../components/loading';
import { playlistMixin } from '../../utils/mixins';

export default {
  mixins: [
    playlistMixin
  ],
  components: {
    Scroll,
    Loading
  },
  data() {
    return {
      tops: []
    };
  },
  computed: {
    ...mapGetters(['tabIndex'])
  },
  methods: {
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    }),
    async getTopList() {
      try {
        this.tops = (await getTopList()).data.list;
      } catch (err) {
        console.log(err);
      }
    },
    selectTopList(topList) {
      this.setTopList(topList);
      this.$router.push(`/top-list/${topList.id}`);
    }
  },
  watch: {
    async tabIndex() {
      if (this.tabIndex === 1 && !this.tops.length) {
        await this.getTopList();

        this.appendBottm(this.playlist);
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
  @import "../../styles/variables"
  @import "../../styles/mixins"

  .top-list
    position: relative

    .tops
      padding: 0 10px
      .top-item
        padding: 10px 0
        border-1px($color-border)
        display: flex
        .left
          .img
            border-radius: 5px
            size: 100px
        .right
          flex: 1
          padding: 8px 10px
          overflow: hidden
          color: #2e3030
          font-size: $font-size-small + 1
          .song-list
            height: 80px
            display: flex
            flex-direction: column
            justify-content: space-between
            .song-item
              no-wrap()

    .loading-wrapper
      absolute: top 50% left 50%
      transform: translate3d(-50%, -50%, 0)

</style>
