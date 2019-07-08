<template>
  <div id="app">
    <Header></Header>
    <Tab></Tab>
    <transition
      appear
      enter-active-class="animated fadeInLeft"
      leave-active-class="animated fadeOutRight"
    >
      <router-view/>
    </transition>
    <Player></Player>
  </div>
</template>

<script>
import Header from './components/header/Header'
import Tab from './components/Tab/Tab'
import Player from './components/player/Player'

export default {
  name: 'App',
  components:{
    Header,
    Tab,
    Player
  }
}
</script>

<style>
</style>
