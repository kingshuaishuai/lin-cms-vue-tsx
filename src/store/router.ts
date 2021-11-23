import Config from '@/config'
import { defineStore } from 'pinia'
import type { RouterState } from './types'

export const useRouterStore = defineStore('router', {
  state: (): RouterState => ({
    sidebarLevel: Config.sidebarLevel || 3,
    defaultRoute: Config.defaultRoute || '/about',
  }),
})
