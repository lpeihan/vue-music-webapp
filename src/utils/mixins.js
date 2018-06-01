import Vue from 'vue';

Vue.mixin({
  methods: {
    hello() {
      console.log('hello mixin');
    }
  }
});
