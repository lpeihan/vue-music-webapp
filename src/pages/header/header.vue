<template>
  <div class="header">
    <icon name="menu"></icon>
    <icon name="logo"></icon>
    <icon name="search"></icon>
  </div>
</template>

<style lang="stylus" scoped>
  @import "../../styles/variables"
  @import "../../styles/mixins"

  .header
    display: flex
    height: 50px
    padding: 0 20px
    color: $white
    align-items: center
    justify-content: space-between
    background: $color-theme

</style>
