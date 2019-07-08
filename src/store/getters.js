const getters={
  //根据当前播放的索引，计算出当前播放歌曲的对象
  currentSong:function(state){
    return state.playList[state.currentIndex];
  }
}
export default getters;
