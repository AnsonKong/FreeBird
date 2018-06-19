import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      { path: '/', component: () => import('./page/Home.vue') },
      { path: '/article/create', component: () => import('./page/WriteArticle.vue') },
      { path: '/article/:id', component: () => import('./page/ReadArticle.vue') }
    ]
  })
}
