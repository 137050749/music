import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home/Home.vue'
import Singer from '../components/Singer/Singer.vue'
import Rank from '../components/Rank/Rank.vue'
import Search from '../components/Search/Search.vue'
import Singer_detail from '../components/singer_detail/Singer_detail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:'/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer,
      children:[
        {
          path:'detail',
          name:'Singer_detail',
          component:Singer_detail
        }
      ]
    },
    {
      path: '/rank',
      name: 'Rank',
      component: Rank
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    }
  ]
})
