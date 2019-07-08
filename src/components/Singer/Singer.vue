<template>
  <div>
    <mt-index-list>
      <mt-index-section v-for='val in singerList' :key="val.index"  :index="val.str">
        <mt-cell v-for='item in val.singerlist' :key="item.singer_mid" :title="item.singer_name">
          <router-link :to="{name:'Singer_detail',params:{
                    singer_mid:item.singer_mid,
                    singer_pic:item.singer_pic,
                    singer_name:item.singer_name
                  }}">
            <img v-lazy="item.singer_pic" />
            {{item.singer_name}}
          </router-link>
        </mt-cell>
      </mt-index-section>
    </mt-index-list>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import axios from 'axios'
import { Indicator } from 'mint-ui'

export default {
  data(){
    return {
      singerList:[],
      list:[],
      indexList:[]
    }
  },
  created(){
    Indicator.open('加载中...');
    axios.get('/apitwo/cgi-bin/musicu.fcg',{
      params:{
        "-": "getUCGI38046945962007683",
        g_tk: 5381,
        loginUin: 0,
        hostUin: 0,
        format: "json",
        inCharset: "utf8",
        outCharset: "utf-8",
        notice: 0,
        platform: "yqq.json",
        needNewCode: 0,
        data: {"comm":{"ct":24,"cv":0},"singerList":{"module":"Music.SingerListServer","method":"get_singer_list","param":{"area":-100,"sex":-100,"genre":-100,"index":-100,"sin":0,"cur_page":1}}}
      }
    })
    .then(res=>{
      this.indexList=res.data.singerList.data.tags.index;
       for(let i=0;i<this.indexList.length;i++){
         axios.get('/apitwo/cgi-bin/musicu.fcg',{
            params:{
              "-": "getUCGI38046945962007683",
              g_tk: 5381,
              loginUin: 0,
              hostUin: 0,
              format: "json",
              inCharset: "utf8",
              outCharset: "utf-8",
              notice: 0,
              platform: "yqq.json",
              needNewCode: 0,
              data: {"comm":{"ct":24,"cv":0},"singerList":{"module":"Music.SingerListServer","method":"get_singer_list","param":{"area":-100,"sex":-100,"genre":-100,"index":this.indexList[i].id,"sin":0,"cur_page":1}}}
            }
          })
          .then(res=>{
            //处理热门歌手
            if(res.data.singerList.data.index==-100){
              this.list.push({
                index:res.data.singerList.data.index,
                str:'Hot',
                singerlist:res.data.singerList.data.singerlist.slice(0,10)
              })
              //处理#号索引
            }else if(res.data.singerList.data.index==27){
               this.list.push({
                  index:res.data.singerList.data.index,
                  str:'#',
                  singerlist:res.data.singerList.data.singerlist.slice(0,10)
              })
              //正常情况A-Z
            }else{
              this.list.push({
                  index:res.data.singerList.data.index,
                  str:String.fromCharCode(res.data.singerList.data.index+64),
                  singerlist:res.data.singerList.data.singerlist.slice(0,10)
              })
            }

            //console.log(this.singerList);
            //循环完毕
            if(i==this.indexList.length-1){
              Indicator.close();
              function sortNumber(a,b){
                return a.index-b.index;
              }
              this.singerList=this.list.sort(sortNumber);
            }
          })
          .catch(err=>{
            console.log(err);
          })
       }
    })
    .catch(err=>{
      console.log(err);
    })
  }
}
</script>
<style lang="stylus" scoped>
@import '~assets/styles/variable.styl';
  .slide-enter-active,.slide-leave-active
    transition all .3s
  .slide-enter,.slide-leave-to
    transform translate3d(100%,0,0)
  .mint-indexlist
    color $color-text-l
    .mint-cell
      padding .2rem
      .mint-cell-value
        font-size $font-size-medium
        img
          width 1rem
          border-radius 50%
          margin-right .2rem
</style>

