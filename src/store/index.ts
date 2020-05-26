import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

axios.defaults.baseURL = process.env.VUE_APP_ROOT_API
const axiosStore = axios.create()

const store = new Vuex.Store({
  state: {
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    userdata: {},
  },
  getters: {
    isLoggedIn(state) {
      return state.accessToken !== null
    },
    getUserdata(state) {
      return state.userdata
    },
  },
  mutations: {
    setTokens(state, tokens) {
      state.accessToken = tokens.access
      state.refreshToken = tokens.refresh
      localStorage.setItem('accessToken', tokens.access)
      localStorage.setItem('refreshToken', tokens.refresh)
    },
    destroyTokens(state) {
      state.accessToken = null
      state.refreshToken = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    },
    setAccessToken(state, access) {
      state.accessToken = access
      localStorage.setItem('accessToken', access)
    },
    destroyAccessToken(state) {
      state.accessToken = null
      localStorage.removeItem('accessToken')
    },
    setRefreshToken(state, refresh) {
      state.refreshToken = refresh
      localStorage.setItem('refreshToken', refresh)
    },
    destroyRefreshToken(state) {
      state.refreshToken = null
      localStorage.removeItem('refreshToken')
    },
    setUserdata(state, data) {
      state.userdata = data
    },
    destroyAllData(state) {
      state.userdata = {}
    },
  },
  actions: {
    async jwtGenerate(context, credentials) {
      await axiosStore.post('/auth/login', {
        username: credentials.username,
        password: credentials.password,
      })
        .then((response) => {
          const accessToken = response.data.access_token
          const refreshToken = response.data.refresh_token
          context.commit('setTokens', { access: accessToken, refresh: refreshToken })
        })
        .catch((error) => {
          context.dispatch('jwtDestroy')
          throw error // critical throw to prevent redirection after failed login
        })
    },
    async jwtRefresh(context) {
      // refreshToken must exist
      if (context.state.refreshToken) {
        axios.defaults.headers.common.Authorization = `Bearer ${context.state.refreshToken}`
        axiosStore.defaults.headers.common.Authorization = `Bearer ${context.state.refreshToken}`
        await axiosStore.get('/auth/refresh')
          .then((response) => {
            const accessToken = response.data.access_token
            context.commit('setAccessToken', accessToken)
            axios.defaults.headers.common.Authorization = `Bearer ${context.state.accessToken}`
            axiosStore.defaults.headers.common.Authorization = `Bearer ${context.state.accessToken}`
          })
          .catch(async (error) => {
            if (error.response && (error.response.status === 401 || 422)) {
              await context.dispatch('jwtDestroy')
            }
          })
      } else {
        // rebuild and force to login if no tokens exist
        await context.dispatch('jwtDestroy')
      }
    },
    async jwtVerify(context) {
      // accessToken must exist else check refresh
      if (context.state.accessToken) {
        axios.defaults.headers.common.Authorization = `Bearer ${context.state.accessToken}`
        axiosStore.defaults.headers.common.Authorization = `Bearer ${context.state.accessToken}`
        await axiosStore.get('/auth/verify')
          // .then(() => true)
          .catch(async (error) => {
            if (error.response && (error.response.status === 401 || 422)) {
              context.commit('destroyAccessToken')
              await context.dispatch('jwtRefresh')
            }
          })
      } else {
        await context.dispatch('jwtRefresh')
      }

      // access token should exist now...
      if (context.state.accessToken) {
        await axiosStore.get('/auth/user_details')
          .then(async (response) => {
            context.commit('setUserdata', response.data.payload)
          })
      }
    },
    jwtDestroy(context) {
      axios.defaults.headers.common.Authorization = null
      axiosStore.defaults.headers.common.Authorization = null
      context.commit('destroyTokens')
      context.commit('destroyAllData')
    },
  },
})

axios.interceptors.request.use(async (config) => {
  await store.dispatch('jwtVerify')
  return config
})

export default store
