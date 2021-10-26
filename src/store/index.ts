import { createStore } from 'vuex'
import VuexPersistance from 'vuex-persist'

interface RootState {}

const vuexLocal = new VuexPersistance<RootState>({
  storage: window.localStorage
})

const store = createStore<RootState>({
  plugins: [
    vuexLocal.plugin
  ]
})

export default store
