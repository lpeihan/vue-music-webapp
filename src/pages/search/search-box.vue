<template>
  <form class="search-box" @submit.prevent="search(query)">
    <div class="back" @click="$router.back()">
      <icon name="back"></icon>
    </div>
    <input
      type="text" class="input" placeholder="搜索歌曲、歌手"
      ref="input"
      v-focus
      @blur="isFocus = false"
      @focus="isFocus = true"
      v-model="query"
    >
    <div class="clear" @click.stop="query = ''" v-show="query"><icon name="delete"></icon></div>
  </form>
</template>

<script>
import { debounce } from '../../utils';

export default {
  data() {
    return {
      query: '',
      isFocus: true
    };
  },
  methods: {
    changeQuery(query) {
      this.query = query;
    },
    search(query) {
      if (query) {
        this.$emit('search', query);
        this.blur();
      }
    },
    blur() {
      this.$refs.input.blur();
    }
  },
  watch: {
    isFocus(newVal) {
      this.$emit('focusChange', newVal);
    }
  },
  created() {
    this.$watch('query', debounce((newVal) => {
      this.$emit('query', newVal);
    }, 300));
  }

};
</script>

<style lang="stylus">
  @import "../../styles/variables"
  @import "../../styles/mixins"

  .search-box
    position: relative
    display: flex
    align-items: center
    height: 55px
    padding: 0 20px 0 50px
    color: $white
    background: $color-theme
    .back
      absolute: left 11px top 16px
      .icon
        font-size: 28px

    .clear
      absolute: right 16px top 16px
      .icon
        font-size: 26px
        color: rgba($white, .4)
    .input
      flex: 1
      height: 32px
      border-bottom: 1px solid r = rgba($white, .4)
      color: rgba($white, .7)
      background: $color-theme
      outline: none
      &::placeholder
        color: r

</style>
