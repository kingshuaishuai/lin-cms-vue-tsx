import { InjectionKey } from '@vue/runtime-core'
import { createStore, Store, useStore as useBaseStore } from 'vuex'
import VuexPersistance from 'vuex-persist'
import routerModule from './modules/router'
import userModule from './modules/user'
import { RootState } from './type'

const vuexLocal = new VuexPersistance<RootState>({
  storage: window.localStorage,
})

export const key: InjectionKey<Store<RootState>> = Symbol()

export const store = createStore<RootState>({
  plugins: [vuexLocal.plugin],
  modules: {
    router: routerModule,
    user: userModule,
  },
})

export function useStore() {
  return useBaseStore(key)
}
