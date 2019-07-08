import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'
import { playMode } from './config'

Vue.use(Vuex)


const state={
  playing:false,//是否播放
  fullScreen:false,//播放器是否是全屏
  playList:[],//播放列表
  RePlayList:[],//播放列表——备份
  mode:playMode.sequence,//默认是顺序播放
  currentIndex:-1//当前播放歌曲的索引
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
