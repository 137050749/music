<template>
  <div class="muisc_list">
    <div class="back" @click="$router.back()"><i class="icon-back"></i></div>
    <h1 class="title" v-text="$route.params.singer_name"></h1>
    <div class="bg-image" ref="bgimage">
      <div class="play_wrapper">
        <div class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter"></div>
    </div>

    <div class="song_list" ref="song_list">
      <div class="list">
        <ul>
          <li class="item" @click="addPlayList(item)" v-for='item in songList' :key="item.mid">
            <div class="content">
              <h2 class="name" v-text="item.name"></h2>
              <p class="desc" v-text="item.singer[0].name"></p>
            </div>
          </li>
        </ul>
      </div>
    </div>


  </div>
</template>
<script>
import axios from 'axios'
import BScroll from 'better-scroll'
import { mapActions } from 'vuex'

export default {
  data(){
    return {
      songList:[]
    }
  },
  mounted(){
    this.$refs.bgimage.style.backgroundImage='url('+this.$route.params.singer_pic+')';

    this.scroll=new BScroll(this.$refs.song_list);
  },
  created(){
    //console.log(this.$route.params.singer_mid);
    if(this.$route.params.singer_mid){
      axios.get('/apitwo/cgi-bin/musicu.fcg',{
        params:{
          '-': 'getUCGI7550291260261504',
          g_tk: 5381,
          loginUin: 0,
          hostUin: 0,
          format: 'json',
          inCharset: 'utf8',
          outCharset: 'utf-8',
          notice: 0,
          platform: 'yqq.json',
          needNewCode: 0,
          data: {"comm":{"ct":24,"cv":0},"singer":{"method":"get_singer_detail_info","param":{"sort":5,"singermid":this.$route.params.singer_mid,"sin":0,"num":10},"module":"music.web_singer_info_svr"}}
        }
      })
      .then(res=>{

        this.songList=res.data.singer.data.songlist;
        //console.log(this.songList);
      })
      .catch(err=>{
        console.log(err)
      })
    }else{
      this.$router.push('/singer');
    }
  },
  methods:{
    //歌曲列表的点击事件，加入播放列表
    ...mapActions(['addPlayList'])
  }
}
</script>
<style lang="stylus" scoped>
@import '~assets/styles/variable.styl';
  .muisc_list
    position fixed
    z-index 100
    top 0
    left 0
    bottom 0
    right 0
    background $color-background
    .back
      position absolute
      top 0
      left .12rem
      .icon-back
        display block
        padding .2rem
        font-size $font-size-large-x
        color $color-theme
    .title
      position absolute
      top 0
      left 10%
      width 80%
      text-align center
      line-height .80rem
      font-size $font-size-large
      color $color-text
    .bg-image
      position relative
      width 100%
      height 0
      padding-top 70%
      transform-origin top
      background-size cover
      background-repeat no-repeat
      z-index -1
      .play_wrapper
        position absolute
        bottom .4rem
        z-index 50
        width 100%
        .play
          box-sizing border-box
          width 2.7rem
          padding .14rem 0
          margin 0 auto
          text-align center
          border 1px solid $color-theme
          border-radius 1rem
          color $color-theme
          .icon-play
            display inline-block
            vertical-align middle
            margin-right .1rem
            font-size $font-size-large
          .text
            display inline-block
            vertical-align middle
            font-size $font-size-small
    .filter
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      background rgba(7,17,27,0.4)
  .song_list
    position absolute
    overflow hidden
    left 0
    top 5.5rem
    right 0
    bottom 0
    background $color-background
    .list
      .item
        display flex
        align-items center
        box-sizing border-box
        height 1.2rem
        font-size $font-size-medium
        .content
          flex 1
          line-height .4rem
          overflow hidden
          padding 0 .4rem
          .name
            color $color-text
          .desc
            color $color-text-d
            margin-top .08rem
</style>
