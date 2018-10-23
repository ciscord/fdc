import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules';

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        user: {}
    },
    mutations: {
      saveUser(state, user) {
        state.user = user
      }
    },
    getters: {
        user: state => state.user
    },
    modules
})