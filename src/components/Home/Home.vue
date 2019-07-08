<template>
  <div class="wrapper" ref="wrapper">
    <div>
      <mt-loadmore ref="loadmore" :top-method="loadTop" @top-status-change="handleTopChange">
        <mt-swipe :auto="4000">
          <mt-swipe-item v-for='item in swiperList' :key="item.id">
              <img :src="item.picUrl"  width="100%"/>
          </mt-swipe-item>
        </mt-swipe>
        <div class="list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="list-item" v-for="item in HotList" :key="item.id">
              <div class="icon">
                <img :src="item.picUrl" width="60" height="60"/>
              </div>
              <div class="text">
                <h2 class="name">{{item.songListAuthor}}</h2>
                <p class="desc">{{item.songListDesc}}</p>
              </div>
            </li>
          </ul>
        </div>
        <div slot="top" class="mint-loadmore-top">
          <span v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">↓</span>
          <span v-show="topStatus === 'loading'">Loading...</span>
        </div>
      </mt-loadmore>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import BScroll from 'better-scroll'

export default {
  data:function(){
    return {
      swiperList:[],
      HotList:[],
      topStatus:''
    }
  },
   created() {
      this.loadMsg();
  },
  mounted(){
    this.scroll=new BScroll(this.$refs.wrapper)
  },
  methods:{
    loadTop(){
      this.loadMsg();
      this.$refs.loadmore.onTopLoaded();
    },
    handleTopChange(status){
      this.topStatus=status
    },
    loadMsg(){
      axios.get('/api/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',{
        params:{
          _:1559802499492,
          g_tk:5381,
          uin: 0,
          format: 'json',
          inCharset: 'utf-8',
          outCharset: 'utf-8',
          notice: 0,
          platform: 'h5',
          needNewCode: 1,
        }
      })
      .then(res=>{
        console.log(res.data.data);
        this.swiperList=res.data.data.slider;
        this.HotList=res.data.data.songList;
      })
      .catch(err=>{
        console.log(err);
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~assets/styles/variable.styl';
  .wrapper
    overflow hidden
    position absolute
    top 1.8rem
    left 0
    right 0
    bottom 0
    .mint-swipe
      overflow hidden
      padding-bottom 40%
      width 100%
      height 0
      .mint-swipe-items-wrap
        width 100%
        height 100%
        .mint-swipe-item
          width 100%
          height 100%
            img
              width 100%
    .list
      .list-title
        height .65rem
        line-height .65rem
        text-align center
        font-size $font-size-medium
        color $color-theme
      .list-item
        display flex
        box-sizing border-box
        align-items center
        padding 0 .4rem .4rem .4rem
        .icon
          flex 0 0 1.2rem
          width 1.2rem
          padding-right .4rem
        .text
          display flex
          flex-direction column
          justify-content center
          flex 1
          line-height .4rem
          overflow hidden
          font-size $font-size-medium
          .name
            color $color-text
            margin-bottom .1rem
          .desc
            color $color-text-d
</style>

