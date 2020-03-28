import Vue from 'vue'
import Router from 'vue-router'

import PageIndex from '@/pages/page-index'

Vue.use(Router)

export default new Router({
  // mode: 'history',

  routes: [
    {
      path: '/',
      name: 'index',
      component: PageIndex
    }
  ]
})
