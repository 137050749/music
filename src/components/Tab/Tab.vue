<template>
  <div class="tab">
    <router-link class="tab-item" tag="div" to="/home"><span>推荐</span></router-link>
    <router-link class="tab-item" tag="div" to="/singer"><span>歌手</span></router-link>
    <router-link class="tab-item" tag="div" to="/rank"><span>排行</span></router-link>
    <router-link class="tab-item" tag="div" to="/search"><span>搜索</span></router-link>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="stylus" scoped>
@import "~assets/styles/variable.styl"
.tab
  display flex
  height .88rem
  line-height .88rem
  font-size $font-size-medium
  .tab-item
    flex 1
    text-align center
    span
      color $color-text-l
      padding-bottom .1rem
    &.router-link-active
      span
        color $color-theme
        border-bottom .04rem solid $color-theme
</style>
