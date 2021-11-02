import router from '@/router'
import { ACTION_TYPES } from '@/store/actionTypes'
import { MUTATION_TYPES } from '@/store/mutationTypes'
import { Permission, PlainObject, RootState, User } from '@/store/type'
import { Module } from 'vuex'

export interface UserState {
  permissions: Permission[]
  user: User | null
  loggedIn: boolean
}

const userModule: Module<UserState, RootState> = {
  state: {
    permissions: [],
    user: null,
    loggedIn: false,
  },
  mutations: {
    [MUTATION_TYPES.SET_USER](state, payload) {
      state.user = payload
    },
    [MUTATION_TYPES.SET_LOGGED_IN](state) {
      state.loggedIn = true
    },
    [MUTATION_TYPES.REMOVE_LOGGED_IN](state) {
      state.user = null
      state.loggedIn = false
    },
  },
  actions: {
    [ACTION_TYPES.LOGOUT]({ commit }) {
      localStorage.clear()
      commit(MUTATION_TYPES.REMOVE_LOGGED_IN)
    },
  },
}

export default userModule
