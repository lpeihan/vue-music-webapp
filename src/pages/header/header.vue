<template>
  <div class="headers">
    <div class="user" @click="$router.push('/user')">
      <icon name="menu"></icon>
    </div>
    <div class="logo" id="vconsole-secret">
      <icon name="logo"></icon>
    </div>
    <div class="search" @click="$router.push('/search')">
      <icon name="search"></icon>
    </div>
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
