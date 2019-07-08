<template>
  <div class="header">
    <div class="icon"></div>
    <h1 class="text">Chicken Music</h1>
    <div class="mine">
      <i class="icon-mine"></i>
    </div>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="stylus" scoped>
@import '~assets/styles/variable.styl'
@import '~assets/styles/mixin.styl'
.header
  position relative
  height .88rem
  text-align center
  color $color-theme
  .icon
    display inline-block
    vertical-align top
    width .6rem
    height .7rem
    bg-image('logo')
    background-size .6rem .7rem
    margin-top .12rem
    margin-right .18rem
  .text
    display inline-block
    vertical-align top
    line-height .88rem
    font-size $font-size-large
  .mine
    position absolute
    top 0
    right 0
    .icon-mine
      display block
      padding .24rem
      font-size $font-size-large
      color $color-theme
</style>

