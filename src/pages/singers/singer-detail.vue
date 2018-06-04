<template>
    <music-list
    :songs="songs"
    :title="singerName"
    :image="singer.avatar"
  >
  </music-list>
</template>

<script>
import MusicList from '../music-list/music-list';
import { getSingerDetail } from '../../api/singers';
import { mapGetters } from 'vuex';
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
    ...mapGetters(['singer']),
    singerName() {
      if (this.singer.alias) {
        return `${this.singer.name} (${this.singer.alias})`;
      }

      return this.singer.name;
    }
  },
  methods: {
    async getSingerDetail(id) {
      try {
        if (!id) {
          this.$router.push('/');
          return;
        }
        const res = (await getSingerDetail(id));
        this.songs = res.data.hotSongs.map((song) => {
          return createSong(song);
        });
      } catch (err) {
        console.log(err);
      }
    }
  },
  created() {
    this.getSingerDetail(this.singer.id);
  }
};
</script>
