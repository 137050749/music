import * as Types from './mutations-types'
import axios from 'axios'
import { Base64 } from 'js-base64';

const actions={
  //加入播放列表
  addPlayList({commit},item){
    //console.log(item);
    //拉取数据
    axios.get('/apitwo/cgi-bin/musicu.fcg',{
      params:{
        '-': 'getUCGI49015090151538554',
        g_tk: 1295618815,
        loginUin: 0,
        hostUin: 0,
        format: 'json',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq.json',
        needNewCode: 0,
        data: {"comm":{"ct":24,"cv":0},"songinfo":{"method":"get_song_detail_yqq","param":{"song_type":0,"song_mid":item.mid,"song_id":200255722},"module":"music.pf_song_detail_svr"}}
      }
    })
    .then(res=>{
      //console.log(res.data.songinfo.data.track_info.album.mid);
      let str=res.data.songinfo.data.track_info.album.mid;
      //封面
      let picPath='//y.gtimg.cn/music/photo_new/T002R300x300M000'+str+'.jpg?max_age=2592000'
      //console.log(picPath);
      axios.get('/apitwo/cgi-bin/musicu.fcg',{
        params:{
          '-': 'getplaysongvkey6555086669113024',
          g_tk: 1295618815,
          loginUin: 0,
          hostUin: 0,
          format: 'json',
          inCharset: 'utf8',
          outCharset: 'utf-8',
          notice: 0,
          platform: 'yqq.json',
          needNewCode: 0,
          data: {"req":{"module":"CDN.SrfCdnDispatchServer","method":"GetCdnDispatch","param":{"guid":"3066685508","calltype":0,"userip":""}},"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"3066685508","songmid":[item.mid],"songtype":[0],"uin":"0","loginflag":1,"platform":"20"}},"comm":{"uin":0,"format":"json","ct":24,"cv":0}}
        }
      })
      .then(res=>{
        //console.log(res);
        //console.log(res.data.req_0.data.sip[1]);
        //console.log(res.data.req_0.data.midurlinfo[0].purl);
        //歌曲播放地址
        let playPath=res.data.req_0.data.sip[1]+res.data.req_0.data.midurlinfo[0].purl;
        // axios.get('/apithree/getlyric',{
        //   params:{
        //     '-': 'MusicJsonCallback_lrc',
        //     pcachetime: 1560388926166,
        //     songmid: '002E3MtF0IAMMY',
        //     g_tk: 1981188434,
        //     loginUin: 0,
        //     hostUin: 0,
        //     format: 'json',
        //     inCharset: 'utf8',
        //     outCharset: 'utf-8',
        //     notice: 0,
        //     platform: 'yqq.json',
        //     needNewCode: 0
        //   }
        // })
        // .then(res=>{
        //   console.log(res);
        // })

        axios.get('/apithree/lyric/fcgi-bin/fcg_query_lyric_new.fcg',{
          params:{
            '-': 'MusicJsonCallback_lrc',
            pcachetime: 1560388926166,
            songmid: item.mid,
            g_tk: 1981188434,
            loginUin: 0,
            hostUin: 0,
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'yqq.json',
            needNewCode: 0
          }
        })
        .then(res=>{
          //base64格式转换
          //console.log(typeof Base64.decode(res.data.lyric));
           let MySongInfo={
            songInfo:item,
            songPic:picPath,
            songUrl:playPath,
            songLyric:Base64.decode(res.data.lyric)
          }
          //提交给mutations
          commit(Types.ADD_PLAYLIST,MySongInfo);
        })



      })
    })
    .catch(err=>{
      console.log(err);
    })

  }
}
export default actions
