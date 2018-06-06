<template>
  <transition>
    <div class="searchs">
      <search-box
        ref="searchBox"
        @query="onQueryChange"
        @focusChange="onFocusChange"
        @search="onSearch"
      >
      </search-box>

      <scroll class="scroll-wrapper" ref="scrollPrev" :data="hots.concat(searchHistory)">
        <div>
          <div class="hots-wrapper">
            <h1 class="title">热门搜索</h1>
            <ul class="hots">
              <li class="hot" v-for="(hot, index) in hots" :key="index" @click="search(hot.first)">
                {{hot.first}}
              </li>
            </ul>
          </div>

          <div class="history-wrapper" v-if="searchHistory.length">
            <h1 class="title">搜索历史
              <span class="clear" @click="clearSearchHistory"><icon name="clear"></icon></span>
            </h1>
            <ul>
              <li v-for="(history, index) in searchHistory" :key="index" class="item" @click="search(history)">
                <div class="text"><icon name="clock"></icon>{{history}}</div>
                <div class="delete" @click.stop="deleteSearchHitory(index)"><icon name="delete"></icon></div>
              </li>
            </ul>
          </div>
          <div class="scroll-bottom" style="height: 60px"></div>
        </div>
      </scroll>

      <transition name="suggests">
        <ul class="suggests" v-show="suggests.length && isFocus">
          <li class="title suggest" @click="search(query)">搜索 "{{query}}"</li>
          <li class="suggest" v-for="(suggest, index) in suggests" :key="index" @click="search(suggest.name)">
            <span class="name">{{suggest.name}}</span>
          </li>
        </ul>
      </transition>

      <scroll class="search-result" v-show="searching || songs.length || singers.length || musicList.length"
        :data="songs"
        :probe-type="3"
        :listen-scroll="true"
        @scroll="onScroll"
        ref="scroll"
      >
        <ul>
          <li v-if="singers.length && songs.length" class="singer" @click="selectSinger(singers[0])">
            <img :src="singers[0].img1v1Url" alt="" width="48" class="img">
            <span class="name">歌手：{{singers[0].name}}</span>
          </li>

          <li v-if="musicList.length && songs.length" class="musicList" @click="selectMusicList(musicList[0])">
            <img :src="musicList[0].coverImgUrl" alt="" width="48" class="img">
            <span class="name">歌单：{{musicList[0].name}}</span>
          </li>

          <li v-for="song in songs" :key="song.id" class="song" @click="selectSong(song)">
            <p class="name">{{song.name}}</p>
            <p class="singer-name">{{song.singer}} <span v-if="song.alias">- {{song.alias}}</span></p>
          </li>

          <li class="loading-container" v-show="searching && songs.length">
            <loading title=""></loading>
          </li>

        </ul>
        <div class="loading-wrapper">
          <loading v-show="searching && !songs.length"></loading>
        </div>
      </scroll>

      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
import SearchBox from './search-box';
import {
  getSearchHot,
  getSearchSuggest,
  getSearchSinger,
  getSearchSongs,
  getSearchMusicList,
  getSongDetail
} from '../../api/search';
import Scroll from '../../components/scroll';
import Loading from '../../components/loading';
import { createSearchSong } from '../../services/song';
import { mapMutations, mapActions, mapGetters } from 'vuex';
import { playlistMixin } from '../../utils/mixins';

export default {
  mixins: [
    playlistMixin
  ],
  components: {
    SearchBox,
    Scroll,
    Loading
  },
  data() {
    return {
      hots: [],
      suggests: [],
      query: '',
      isFocus: true,
      singers: [],
      songs: [],
      searching: false,
      musicList: []
    };
  },
  computed: {
    ...mapGetters(['searchHistory'])
  },
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER',
      setMusicList: 'SET_MUSIC_LIST',
      setSearchHistory: 'SET_SEARCH_HISTORY'
    }),
    ...mapActions(['insertSong']),
    async selectSong(song) {
      getSongDetail(song.id).then((res) => {
        song.image = res.data.songs[0].al.picUrl;
        this.insertSong(song);
      });
    },
    selectSinger(singer) {
      this.setSinger({
        id: singer.id,
        name: singer.name,
        avatar: singer.img1v1Url,
        alias: singer.alias[0]
      });

      this.$router.push(`/search/singers/${singer.id}`);
    },
    selectMusicList(musicList) {
      musicList.picUrl = musicList.coverImgUrl;
      this.setMusicList(musicList);

      this.$router.push(`/search/recommends/${musicList.id}`);
    },
    onFocusChange(value) {
      this.isFocus = value;
    },
    onSearch(query) {
      this.search(query);
    },
    onScroll(pos, maxScrollY) {
      if (pos.y <= maxScrollY && !this.searching) {
        this.searchMore();
      }
    },
    async searchMore() {
      try {
        this.searching = true;

        const res = await getSearchSongs(this.query, this.songs.length);

        const songs = res.data.result.songs.map(song => {
          return createSearchSong(song);
        });

        setTimeout(() => {
          this.songs = this.songs.concat(songs);
          this.searching = false;
        }, 500);
      } catch (err) {
        this.searching = false;
        console.log(err);
      }
    },
    saveSearchHistory(history) {
      const searchs = this.searchHistory.slice();

      const index = searchs.findIndex(item => item === history);

      if (index > -1) {
        searchs.splice(index, 1);
      }

      searchs.unshift(history);

      if (searchs.length > 10) {
        searchs.pop();
      }

      this.setSearchHistory(searchs);
    },
    deleteSearchHitory(index) {
      const searchs = this.searchHistory.slice();

      searchs.splice(index, 1);
      this.setSearchHistory(searchs);
    },
    clearSearchHistory() {
      this.setSearchHistory([]);
    },
    resetSearch() {
      this.singers = [];
      this.musicList = [];
      this.songs = [];
    },
    async search(query) {
      try {
        this.searching = true;
        this.resetSearch();
        this.$refs.searchBox.changeQuery(query);
        this.saveSearchHistory(query);

        const [ singers, songs, musicList ] = await Promise.all([
          getSearchSinger(query),
          getSearchSongs(query),
          getSearchMusicList(query)
        ]);

        setTimeout(() => {
          this.singers = singers.data.result.artists || [];
          this.musicList = musicList.data.result.playlists || [];
          this.songs = (songs.data.result.songs || []).map(song => {
            return createSearchSong(song);
          });

          this.appendBottm();

          this.searching = false;
        }, 500);
      } catch (err) {
        this.searching = false;
        console.log(err);
      }
    },
    async getSearchHot() {
      try {
        const res = await getSearchHot();

        this.hots = res.data.result.hots;
      } catch (err) {
        console.log(err);
      }
    },
    async onQueryChange(query) {
      try {
        this.resetSearch();
        if (!query) {
          this.suggests = [];
          return;
        }
        this.query = query;
        const res = await getSearchSuggest(query);
        const { albums, artists, playlists, songs } = res.data.result;

        const suggests = (artists || []).concat(songs || [], playlists || [], albums || []);
        this.suggests = suggests.slice(0, 10);
      } catch (err) {
        console.log(err);
      }
    },
    handleClick(el) {
      el.addEventListener('myCustomTapEvent', () => {
        this.$refs.searchBox.blur();
      }, false);
    }
  },
  mounted() {
    this.handleClick(this.$refs.scroll.$el);
    this.handleClick(this.$refs.scrollPrev.$el);
  },
  created() {
    this.getSearchHot();
  }
};
</script>

<style lang="stylus">
  @import "../../styles/variables"
  @import "../../styles/mixins"

  .searchs
    fixed: top 0 right 0 bottom 0 left 0
    background: $color-background
    &.v
      &-enter-active
      &-leave-active
        transition: all .4s
      &-enter
      &-leave-to
        transform: translate3d(100%, 0, 0)

    .scroll-wrapper
      height: calc(100% - 55px)
      overflow: hidden
      padding: 0 20px

      .hots-wrapper
        .title
          font-size: $font-size-medium
          color: $color-text-l
          padding: 24px 0 12px
        .hots
          display: flex
          flex-wrap: wrap
          .hot
            padding: 8px 10px
            border: 1px solid $color-border
            margin: 0 12px 12px 0
            border-radius: 5px
            font-size: $font-size-medium
      .history-wrapper
        margin-top: 10px
        .title
          height: 40px
          display: flex
          align-items: center
          font-size: $font-size-medium
          color: $color-text-l
          justify-content: space-between
          .icon
            font-size: $font-size-medium-x
        .item
          height: 40px
          display: flex
          align-items: center
          font-size: $font-size-medium + 1
          justify-content: space-between
          .text
            display: flex
            line-height: 20px
            align-items: center
            .icon
              font-size: 20px
              margin-right: 2px
              color: $color-text-l
          .delete
            .icon
              font-size: $font-size-large
              color: $color-text-l

    .suggests
      absolute: top 55px left 20px right 20px
      background: $color-background
      border-radius: 1px
      box-shadow: 0 0 30px rgba(0, 0, 0, .3)
      z-index: 100

      &.suggests
        &-enter-active
        &-leave-active
          transition: all .3s
        &-enter
        &-leave-to
          transform: scale(.98)
          opacity: 0

      .suggest
        display: flex
        align-items: center
        height: 44px
        padding: 0 10px
        font-size: 15px
        color: $color-text
        border-1px($color-border)

      .title
        color: #337ab7

    .search-result
      absolute: top 55px left 0 right 0
      height: calc(100% - 55px)
      background: $color-background
      padding: 0 15px
      overflow: hidden
      ul
        padding-bottom: 50px
      .singer, .musicList
        padding: 8px 0
        display: flex
        align-items: center
        font-size: 15px
        height: 48px
        border-1px()
        .img
          border-radius: 4px
        .name
          margin-left: 10px
      .song
        padding: 15px 0
        border-1px()
        .name
          font-size: 15px
          line-height: 22px
        .singer-name
          margin-top: 8px
          color: $color-text-l
          font-size: $font-size-small
      .loading-container
        height: 60px
        display: flex
        justify-content: center
        align-items: center
      .loading-wrapper
        absolute: top 50% left 50%
        transform: translate3d(-50%, -50%, 0)

</style>
