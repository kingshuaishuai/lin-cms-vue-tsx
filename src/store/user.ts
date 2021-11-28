import { deepGetSidebar, getPermissionStageConfig } from '@/utils/stage'
import { defineStore } from 'pinia'
import stageConfig from '@/config/stage'
import type { UserState } from './types'
import type { MenuItem } from '@/components/layout/Sidebar/types'

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    permissions: [],
    user: null,
    loggedIn: false,
  }),
  getters: {
    sidebarList: (state) => {
      const { permissions, user } = state
      const permissionState = getPermissionStageConfig(
        stageConfig,
        permissions,
        user,
      )
      return deepGetSidebar(permissionState) as MenuItem[]
    },
  },
  actions: {
    setUser(user: UserState['user']) {
      this.user = user
      this.permissions =
        user?.permissions
          .map((item) => Object.values(item))
          .flat(2)
          .map((item) => item.permission) || []
    },
    setLoggedIn() {
      this.loggedIn = true
    },
    removeLoggedIn() {
      this.user = null
      this.loggedIn = false
      this.permissions = []
    },
    logout() {
      localStorage.clear()
      this.removeLoggedIn()
    },
  },
})
