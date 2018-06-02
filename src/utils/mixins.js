import Vue from 'vue';
import { mapGetters } from 'vuex';

Vue.mixin({});

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  methods: {
    appendBottm(el) {
      const bottom = document.createElement('div');
      bottom.setAttribute('class', 'scroll-bottom');

      el.appendChild(bottom);
    },
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method');
    }
  },
  watch: {
    playList(val) {
      this.handlePlaylist(val);
    }
  }
};
