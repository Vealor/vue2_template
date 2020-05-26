import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const routerOptions = [
  { path: '/', name: 'home', component: 'Home' },
  { path: '/login', name: 'login', component: 'Login' },
  { path: '/logout', name: 'logout', component: 'Logout' },
  { path: '*', name: '404', component: 404 },
]

const routes: Array<RouteConfig> = routerOptions.map((route) => ({
  ...route,
  component: () => import(`@/views/${route.component}.vue`),
}))

const router = new VueRouter({
  routes,
  mode: 'history',
  base: process.env.BASE_URL,
})

router.beforeEach(async (to, from, next) => {
  try {
    await store.dispatch('jwtVerify')
  } catch (error) {
    store.commit('destroyTokens')
  }

  // Order of operation is important for these if statements
  if (store.getters.isLoggedIn && store.getters.getUserdata.req_pass_reset && to.fullPath !== '/reset' && to.fullPath !== '/logout') {
    next('/reset')
  } else if (to.fullPath === '/reset' && !store.getters.getUserdata.req_pass_reset) {
    if (from.fullPath !== '/reset') {
      next('/')
    } else {
      next(from.fullPath)
    }
  } else if (!store.getters.isLoggedIn && to.fullPath !== '/login') {
    next('/login')
  } else {
    next()
  }
})

export default router
