<template>
  <div class="player" v-if="playList.length>0">
    <transition
      mode="out-in"
      enter-active-class="animated fadeInUp"
      leave-active-class="animated fadeOutDown"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.songPic" width="100%" height="100%"/>
        </div>
        <div class="top">
          <div class="back">
            <i class="icon-back" @click="playerback"></i>
          </div>
          <h1 class="title" v-text="currentSong.songInfo.name"></h1>
          <h2 class="subtitle" v-text="currentSong.songInfo.singer[0].name"></h2>
        </div>
        <div class="middle">
          <mt-swipe :auto="0">
            <mt-swipe-item>
              <div class="middle-l">
                <div class="cd-wrapper">
                  <div class="cd" :class="cdClass">
                    <img :src="currentSong.songPic" />
                  </div>
                </div>
                <div class="lyric-wrapper">
                  <div class="lyric" v-text="playingLyric"></div>
                </div>
              </div>
            </mt-swipe-item>
            <mt-swipe-item>
              <div class="middle-r" ref="lyriclist">
                <div class="lyric-warapper">
                  <div v-if='currentLyric'>
                    <p ref='lyricline' class="text" :class="{'current':currentLineNum===index}" v-for='(item,index) in currentLyric.lines' :key="item.time" v-text="item.txt"></p>
                  </div>
                </div>
              </div>
            </mt-swipe-item>
          </mt-swipe>

        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l" v-text="format(currentTime)"></span>
            <div class="progress-bar-wrapper">
                <mt-range @input="rangeInput" @change="rangeChange" v-model="rangeValue"></mt-range>
            </div>
            <span class="time time-r" v-text="format(duration)"></span>
          </div>
          <div class="btns">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableClass">
              <i @click.stop="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableClass">
              <i @click.stop="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableClass">
              <i @click.stop="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition
      mode="out-in"
      enter-active-class="animated fadeInUp"
      leave-active-class="animated fadeOutDown"
    >
      <div class="playlist" v-if="isplaylist">
        <ul>
          <li v-for="(item,index) in playList" :key="item.songInfo.mid">
            <span @click="playMusic(item.songInfo)">{{item.songInfo.name}}</span>
            <i @click="deleteMusic(index)" class="icon-dismiss"></i>
          </li>
        </ul>
      </div>
    </transition>

     <transition
      enter-active-class="animated fadeInUp"
      leave-active-class="animated fadeOutDown"
    >
      <div class="mini-player" v-show="!fullScreen">
        <div class="mini-cd">
          <img @click="btnChangeFull" :class="cdClass" :src="currentSong.songPic"  width="40" height="40"/>
        </div>
        <div class="text">
          <h2 class="name" v-text="currentSong.songInfo.name"></h2>
          <p class="singer" v-text="currentSong.songInfo.singer[0].name"></p>
        </div>
        <div class="control">
          <i @click.stop="togglePlaying" :class="playIconMini"></i>
          <canvas ref="mini_progress" class="mini_progress" width="32" height="32"></canvas>
        </div>
        <div class="control">
          <i @click="showPlayList" class="icon-playlist"></i>
        </div>
      </div>

    </transition>
    <!-- timeupdate表示当前视频或者音频正在播放 -->
    <audio ref="audio" @timeupdate="updatetime" @canplay='ready' @error="error" :src="currentSong.songUrl"></audio>
  </div>
</template>
<script>
import { UPDATE_FULLSCREEN,UPDATE_PLAYING,UPDATE_CURRENTINDEX ,UPDATE_PLAYING_BOOL,UPDATE_MODE,UPDATE_PLAYLIST_RANDOM ,UPDATE_PLAYLIST_SEQUENCE,DELETE_PLAYLIST_INDEX} from '../../store/mutations-types'
import { mapState,mapGetters,mapActions } from 'vuex'
import { playMode } from '@/store/config'
import Lyric from 'lyric-parser'
import BScroll from 'better-scroll'

export default {
  data(){
    return {
      //播放进度（百分比）
      rangeValue:0,
      //表示当前歌曲是否准备完毕
      songReady:false,
      //当前播放时间
      currentTime:0,
      //当前歌曲总时长
      duration:0,
      //存放被格式化的歌词
      currentLyric:null,
      //当前正在播放的歌词的索引
      currentLineNum:0,
      //存放BS返回的对象
      scroll:null,
      //mini歌词
      playingLyric:'',
      //控制播放列表显示或者隐藏
      isplaylist:false
    }
  },
  computed:{
    ...mapState(['fullScreen','playList','playing','currentIndex','mode']),
    ...mapGetters(['currentSong']),
    playIcon(){
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    playIconMini(){
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    //根据播放的状态决定cd的转动
    cdClass(){
      return this.playing ? 'play' : 'play pause'
    },
    disableClass(){
      return this.songReady ? '' : 'disable'
    },
    //根据当前播放的模式，设置模式图标
    iconMode(){
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    }
  },
  mounted(){
    // this.$nextTick(()=>{
    //   if(this.currentSong.songUrl){
    //     this.$refs.audio.play();
    //   }
    // })
  },
  // updated(){
  //   this.$refs.audio.play();
  // },
  methods:{
    ...mapActions(['addPlayList']),
    //删除播放列表歌曲
    deleteMusic(index){
      this.$store.commit(DELETE_PLAYLIST_INDEX,index);
      //console.log(index);
      if(index<this.currentIndex){
        this.$store.commit(UPDATE_CURRENTINDEX,this.currentIndex-1);
      }

    },
    //播放列表点击播放歌曲
    playMusic(item){
      this.addPlayList(item);
      this.isplaylist=false;
    },
    //显示/隐藏播放列表
    showPlayList(){
      this.isplaylist=!this.isplaylist;
    },
    //格式化歌词
    getLyric(){
      if(this.currentSong){
        this.currentLyric=new Lyric(this.currentSong.songLyric, this.handlerLyric)
        //console.log(this.currentLyric);
        if(this.playing){
          //让歌词也播放
          this.currentLyric.play();
        }
      }else{
        //没有歌词
        this.currentLyric=null;
        this.playingLyric='';
        this.currentLineNum=0;
      }
    },
    //格式化歌词回调
    handlerLyric({lineNum, txt}){
      this.currentLineNum=lineNum;
      if(lineNum>5){
        //this.$refs.lyricline获得所有的p标签（所有歌词元素）
        //查找当前正在播放的歌词所在的p标签
        let lineEl=this.$refs.lyricline[lineNum-5];
        //让BS滚动到当前正在播放的p标签
        //scrollToElement 滚动到某个元素,滚动时间
        this.scroll.scrollToElement(lineEl,1000);
      }else{
        //scrollTo滚动到某个位置
        this.scroll.scrollTo(0,0,1000);
      }

      this.playingLyric=txt;
      console.log(lineNum),
      console.log(txt)
    },
    //改变当前的播放模式
    changeMode(){
      this.$store.commit(UPDATE_MODE);
      console.log(this.mode);
      //切换到了随机播放
      if(this.mode===playMode.random){
        this.$refs.audio.loop=false;
        console.log('随机');
        this.$store.commit(UPDATE_PLAYLIST_RANDOM);
      }else{
        console.log('顺序');
        if(this.mode===playMode.loop){
          //设置当前播放器单曲循环
          this.$refs.audio.loop=true;
        }else{
          this.$refs.audio.loop=false;
        }

        this.$store.commit(UPDATE_PLAYLIST_SEQUENCE)
      }
    },
    playerback(){
      this.$store.commit(UPDATE_FULLSCREEN);
    },
    btnChangeFull(){
      this.$store.commit(UPDATE_FULLSCREEN);
    },
    togglePlaying(){
      //歌曲没有准备好
      if(!this.songReady){
        return
      }
      this.$store.commit(UPDATE_PLAYING);
      //暂停时停止歌词播放
      if(this.currentLyric){
        this.currentLyric.togglePlay();
      }
    },
    //上一曲
    prev(){
      //歌曲没有准备好
      if(!this.songReady){
        return
      }
      let index=this.currentIndex - 1;
      if(index===-1){
        index=this.playList.length-1;
      }
      this.$store.commit(UPDATE_CURRENTINDEX,index);
      if(!this.playing){
        this.$store.commit(UPDATE_PLAYING);
      }

      //将准备状态设为false
      this.songReady=false;
    },
    //下一曲
    next(){
      //歌曲没有准备好
      if(!this.songReady){
        return
      }
      let index=this.currentIndex + 1;
      if(index===this.playList.length){
        index=0;
      }
      this.$store.commit(UPDATE_CURRENTINDEX,index);
      if(!this.playing){
        this.$store.commit(UPDATE_PLAYING);
      }

      //将准备状态设为false
      this.songReady=false;
    },
    //歌曲准备完毕
    ready(){
      //console.log(1);
      this.songReady=true;
      this.duration=this.$refs.audio.duration;

      if(this.currentLyric){
        //设置歌词到开始的位置
        this.currentLyric.seek(0);
      }
    },
    error(){
      this.songReady=true;
    },
    //当前播放时间发送改变
    updatetime(e){
      //console.log(this.$refs.audio.currentTime);
      //console.log(e.target.currentTime);
      this.currentTime=e.target.currentTime;
      //设置进度条的进度  0-100
      this.rangeValue=this.currentTime / this.duration * 100;
      //调用方法绘制mini进度条
      if(this.currentSong){
        this.drawMiniProgress(this.currentTime);
      }//
      //当播放时间等于歌曲的总时长的时候，改变播放状态
      if(this.currentTime==this.duration){
        //将播放状态设置为暂停
        this.$store.commit(UPDATE_PLAYING_BOOL,false);
        //直接下一曲
        this.next();
      }

    },
    //格式化当前时间
    format(t){
      t=t | 0;
      let m= t / 60 | 0;
      let s= t % 60;
      if(s<10){
        s="0"+s;
      }
      return `${m}:${s}`;
    },
    rangeInput(){
      //console.log(this.rangeValue);
      this.$refs.audio.pause();
      //将播放状态设置为暂停
      this.$store.commit(UPDATE_PLAYING_BOOL,false);
      //当前拖动的百分比*歌曲的总时长=当前播放的时间
      this.$refs.audio.currentTime=this.rangeValue/100 * this.duration;
      // if(this.currentLyric){
      //   this.currentLyric.stop();
      // }
    },
    rangeChange(){
      //console.log(this.rangeValue);
      //将播放状态设置为暂停
      this.$store.commit(UPDATE_PLAYING_BOOL,true);
      if(this.currentLyric){
        //根据当前进度条拖动位置，设置当前歌词应当播放位置  单位毫秒
        this.currentLyric.seek(this.rangeValue/100 * this.duration*1000);
        //this.currentLyric.play();
      }
    },
    //canvas绘制mini进度条
    drawMiniProgress(now){
      let canvas=this.$refs.mini_progress;
      //now*360/this.duration
      let ctx=canvas.getContext('2d');
      ctx.clearRect(0,0,32,32);
      ctx.beginPath();
      ctx.strokeStyle='#ffcd32';
      ctx.lineWidth=2;
      ctx.arc(16,16,14,now*360/this.duration*Math.PI/180,360*Math.PI/180,true);
      ctx.stroke();
    }
  },
  watch:{
    //监听当前播放歌曲发送变化
    currentSong(){
      //console.log(this.currentSong);
      this.$nextTick(()=>{
        if(this.currentLyric){
          this.currentLyric.stop();
        }

        //歌曲发生变化，但必须有值才能使用下面的三种方法
        if(this.currentSong){
           //歌词
          this.getLyric();
          this.$refs.audio.play();
          this.scroll=new BScroll(this.$refs.lyriclist);
        }
      })
    },
    playing(newplaying){
      this.$nextTick(()=>{
        newplaying ? this.$refs.audio.play() :  this.$refs.audio.pause();
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~assets/styles/variable.styl';
  .player
    .normal-player
      position fixed
      left 0
      right 0
      bottom 0
      top 0
      z-index 150
      background $color-background
      .background
        position absolute
        left 0
        top 0
        bottom 0
        right 0
        z-index -1
        opacity .6
        filter blur(20px)
      .top
        position relative
        .back
          position absolute
          top 0
          left .4rem
          z-index 50
          .icon-back
            display block
            padding .18rem
            font-size $font-size-large-x
            color $color-theme
            transform rotate(-90deg)
        .title
          width 70%
          margin 0 auto
          text-align center
          line-height .8rem
          font-size $font-size-medium-x
        .subtitle
          text-align center
          line-height .4rem
          font-size $font-size-medium
          color $color-text
      .middle
        position fixed
        width 100%
        top 1.6rem
        bottom 3.4rem
        .middle-l
          display inline-block
          vertical-align top
          position relative
          width 100%
          height 0
          padding-bottom 80%
          .cd-wrapper
            position absolute
            width 80%
            left 10%
            top 0
            height 100%
            .cd
              width 100%
              height 100%
              box-sizing border-box
              border .2rem solid rgba(255,255,255,.1)
              border-radius 50%
              position relative
              &.play
                animation rotate 20s linear infinite
              &.pause
                animation-play-state paused
              img
                position absolute
                left 0
                top 0
                width 100%
                height 100%
                border-radius 50%
        .lyric-wrapper
          width 80%
          text-align center
          margin 0 10%
          position absolute
          bottom -1rem
          .lyric
            height .4rem
            line-height .4rem
            font-size $font-size-medium
            color $color-text-l
        .middle-r
          display inline-block
          vertical-align top
          width 100%
          height 90%
          overflow hidden
          position absolute
          top 0
          left 0
          right 0
          bottom 0
          .lyric-warapper
            width 80%
            margin 0 auto
            text-align center
            overflow hidden
            .text
              line-height .6rem
              color $color-text-l
              &.current
                color $color-text
      .bottom
        position absolute
        bottom 1rem
        width 100%
        .progress-wrapper
          display flex
          align-items center
          width 80%
          margin 0 auto
          padding .1rem 0
          .time
            color $color-text
            font-size $font-size-small
            flex 0 0 .6rem
            line-height .6rem
            width .6rem
            &.time-l
              text-align left
            &.time-r
              text-align right
          .progress-bar-wrapper
            flex 1
        .btns
          display flex
          align-items center
          margin-top .4rem
          .icon
            flex 1
            color $color-theme
            font-size $font-size-large-xx
          .i-left
            text-align right
          .i-right
            text-align left
          .i-center
            text-align center
            padding 0 .4rem
            font-size $font-size-large-xxx
            &.disable
              color $color-text-d
    .playlist
      position fixed
      left 0
      bottom 1.25rem
      width 100%
      height 3rem
      z-index 200
      background $color-highlight-background
      border-top 1px solid #000
      border-radius .4rem .4rem 0 0
    .mini-player
      position fixed
      left 0
      bottom 0
      z-index 180
      width 100%
      height 1.2rem
      background $color-highlight-background
      display flex
      align-items center
      .mini-cd
        flex 0 0 .8rem
        width .8rem
        padding 0 .2rem 0 .4rem
        img
          border-radius 50%
          &.play
            animation rotate 10s linear infinite
          &.pause
            animation-play-state paused
      .text
        display flex
        flex-direction column
        flex 1
        line-height .4rem
        overflow hidden
        .name
          font-size $font-size-medium
          margin-bottom .04rem
        .singer
          font-size $font-size-small
          color $color-text-d
      .control
        flex 0 0 .6rem
        width .6rem
        font-size $font-size-large-xx
        color $color-theme-d
        padding 0 .2rem
        position relative
        .mini_progress
          position absolute
          top -.01rem
          left .18rem
          z-index -1
@keyframes rotate
  0%
    transform rotate(0)
  100%
    transform rotate(360deg)

</style>
