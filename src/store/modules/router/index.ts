import { Module } from 'vuex'
import { RootState } from '@/store/type'
import Config from '@/config'

export interface RouterState {
  sidebarLevel: number
  defaultRoute: string
}

const routerModule: Module<RouterState, RootState> = {
  state: {
    sidebarLevel: Config.sidebarLevel || 3,
    defaultRoute: Config.defaultRoute || '/about',
  },
}

export default routerModule
