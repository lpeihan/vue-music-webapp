<template>
  <music-list
    :songs="songs"
    :avatar="avatar"
    :title="musicList.name"
    :nickname="nickname"
    :image="musicList.picUrl"
  >
  </music-list>
</template>

<script>
import { mapGetters } from 'vuex';
import { getRecommendDetail } from '../../api/recommends';
import { createSong } from '../../services/song';
import MusicList from '../music-list/music-list';

export default {
  components: {
    MusicList
  },
  data() {
    return {
      songs: [],
      avatar: '',
      nickname: ''
    };
  },
  computed: {
    ...mapGetters(['musicList'])
  },
  methods: {
    async getRecommendDetail(id) {
      try {
        const res = await getRecommendDetail(id);

        if (res.status === 200) {
          this.avatar = res.data.playlist.creator.avatarUrl;
          this.nickname = res.data.playlist.creator.nickname;
          this.songs = res.data.playlist.tracks.map((song) => {
            return createSong(song);
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
  created() {
    this.getRecommendDetail(this.musicList.id || this.$route.params.id);
  }
};
</script>
