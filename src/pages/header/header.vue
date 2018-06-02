<template>
  <div class="headers">
    <icon name="menu"></icon>
    <div class="logo">
      <icon name="logo"></icon>
    </div>
    <icon name="search"></icon>
  </div>
</template>

<style lang="stylus">
  @import "../../styles/variables"
  @import "../../styles/mixins"

  .headers
    display: flex
    height: 45px
    padding: 5px 20px 0
    color: $white
    align-items: center
    justify-content: space-between
    background: $color-theme
    .logo
      .icon
        font-size: 30px
        color: rgba($white, .5)

</style>
