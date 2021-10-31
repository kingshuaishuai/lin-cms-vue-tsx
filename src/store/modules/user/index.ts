import { Permission, PlainObject, RootState, User } from '@/store/type'
import { Module } from 'vuex'

export interface UserState {
  permissions: Permission[]
  user: PlainObject | User
}

const userModule: Module<UserState, RootState> = {
  namespaced: true,
  state: {
    permissions: [],
    user: {
      id: 1,
      admin: true,
      avatar: null,
      email: null,
      nickname: 'hello',
      permission: [],
    },
  },
}

export default userModule
