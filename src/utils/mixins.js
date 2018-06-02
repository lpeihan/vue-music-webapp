import Vue from 'vue';
import { mapGetters } from 'vuex';

Vue.mixin({});

const PLAYLIST = 'playlist';

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  methods: {
    appendBottm(el) {
      const bottom = document.createElement('div');
      bottom.style.height = '60px';
      bottom.setAttribute(PLAYLIST, PLAYLIST);

      if (el.lastChild.getAttribute(PLAYLIST) !== PLAYLIST) {
        el.appendChild(bottom);
      }
    },
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method');
    }
  },
  watch: {
    playlist(val) {
      this.handlePlaylist(val);
    }
  },
  mounted() {
    this.handlePlaylist(this.playlist);
  }
};
