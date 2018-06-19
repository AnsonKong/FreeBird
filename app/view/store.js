import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      user: null,
      navHeaderHeight: 80
    },
    actions: {
      updateUser (state, user) {
        state.commit('setUser', user)
      }
    },
    mutations: {
      setUser (state, user) {
        state.user = user
      }
    }
  })
}