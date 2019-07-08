import * as Types from './mutations-types'
import { ArrRandom } from '../common/index'

const mutations={
  [Types.ADD_PLAYLIST](state,item){
    //查找当前添加的歌曲是否已经存在于播放列表中
    let music=state.playList.find(val=>val.songInfo.mid===item.songInfo.mid);
    if(music){
       //显示全屏的播放器
       state.fullScreen=true;
       //歌曲存在，找当前歌曲的索引
       //console.log(state.playList.indexOf(music));
       //当前用户点击的这个歌曲的索引设置为当前播放的索引
       state.currentIndex=state.playList.indexOf(music);
    }else{
      //往播放列表中添加歌曲
      state.playList=[...state.playList,item];
      state.RePlayList=[...state.RePlayList,item];
      //state.RePlayList= state.playList;
      //显示全屏的播放器
      state.fullScreen=true;
      //索引
      //console.log(state.playList.length-1);
      //当前用户点击的这个歌曲的索引设置为当前播放的索引
      state.currentIndex=state.playList.length-1;
    }
    //设置播放状态为播放
    state.playing=true;
    console.log(state.playList);
    console.log(state.RePlayList);
  },
  //修改当前播放器显示状态
  [Types.UPDATE_FULLSCREEN](state){
    state.fullScreen=!state.fullScreen;
  },
  //修改当前播放状态
  [Types.UPDATE_PLAYING](state){
    state.playing=!state.playing;
  },
  //修改当前播放状态
  [Types.UPDATE_PLAYING_BOOL](state,bool){
    state.playing=bool;
  },
  //修改当前播放的索引（上下一曲）
  [Types.UPDATE_CURRENTINDEX](state,index){
    state.currentIndex=index;
  },
  //修改当前播放模式
  [Types.UPDATE_MODE](state){
    //0 1 2
    state.mode=(state.mode+1) % 3
  },
  //修改当前播放列表为随机
  [Types.UPDATE_PLAYLIST_RANDOM](state){
    state.playList=ArrRandom(state.playList);
  },
  //修改当前播放列表为顺序
  [Types.UPDATE_PLAYLIST_SEQUENCE](state){
    //JSON.parse(JSON.stringify(obj))
    state.playList=state.RePlayList;
  },
  //删除播放列表的歌曲
  [Types.DELETE_PLAYLIST_INDEX](state,index){
    state.playList.splice(index,1);
    console.log(state.playList);
  }
}
export default mutations;
