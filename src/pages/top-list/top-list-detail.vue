<template>
  <music-list
    :songs="songs"
    :image="topList.coverImgUrl"
    :title="topList.name"
  >
  </music-list>
</template>

<script>
import MusicList from '../music-list/music-list';
import { mapGetters } from 'vuex';
import { getTopListDetail } from '../../api/top-list';
import { createSong } from '../../services/song';

export default {
  components: {
    MusicList
  },
  data() {
    return {
      songs: []
    };
  },
  computed: {
    ...mapGetters(['topList'])
  },
  methods: {
    async getTopListDetail(id) {
      try {
        if (!id) {
          this.$router.push('/');
          return;
        }
        const res = await getTopListDetail(id);

        this.songs = res.data.playlist.tracks.map((song) => {
          return createSong(song);
        });
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    }
  },
  created() {
    this.getTopListDetail(this.topList.id);
  }
};
</script>
