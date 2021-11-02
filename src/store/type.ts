import { RouterState } from './modules/router'
import { UserState } from './modules/user'

export type Permission = string

export interface PlainObject {
  [key: string]: any
}

export interface User {
  id: number
  admin: boolean
  avatar: string | null
  email: string | null
  nickname: string
  username: string
  permissions: Array<{
    [key: string]: Array<{
      permission: string
      module: string
    }>
  }>
}

export interface RootState {
  router: RouterState
  user: UserState
}
