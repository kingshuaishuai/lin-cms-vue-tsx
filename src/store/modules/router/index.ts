import { Module } from 'vuex'
import { RootState } from '@/store/type'
import stageConfig from '@/config/stage'
import { RouterRecordDesc } from '@/utils/types'
import Config from '@/config'

export interface RouterState {
  stageConfig: RouterRecordDesc[]
  sidebarLevel: number
  defaultRoute: string
}

const routerModule: Module<RouterState, RootState> = {
  namespaced: true,
  state: {
    stageConfig,
    sidebarLevel: Config.sidebarLevel || 3,
    defaultRoute: Config.defaultRoute || '/about',
  },
}

export default routerModule
