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
    appendBottm(playlist) {
      const el = this.$refs.scroll.$el.children[0];

      if (playlist.length && el.lastChild.getAttribute(PLAYLIST) !== PLAYLIST) {
        const bottom = document.createElement('div');
        bottom.style.height = '60px';
        bottom.setAttribute(PLAYLIST, PLAYLIST);

        el.appendChild(bottom);
        this.$refs.scroll.refresh();
      } else if (!playlist.length && el.lastChild.getAttribute(PLAYLIST) === PLAYLIST) {
        el.removeChild(el.lastChild);
        this.$refs.scroll.refresh();
      }
    }
  },
  watch: {
    playlist(val) {
      this.appendBottm(val);
    }
  },
  mounted() {
    this.appendBottm(this.playlist);
  }
};

export const showMixin = {
  data() {
    return {
      show: false,
      name: 'default'
    };
  },
  methods: {
    open(name = this.name) {
      this.show = true;
      this.name = name;
      const hash = location.hash ? `&${name}` : `#${name}`;
      history.pushState({ page: name }, name, `${location.href}${hash}`);
    },
    back() {
      history.go(-1);
    },
    close() {
      if (location.hash.indexOf(this.name) === -1) {
        this.show = false;
      }
    }
  },
  created() {
    addEventListener('popstate', this.close);
  }
};
