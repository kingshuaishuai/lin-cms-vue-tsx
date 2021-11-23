export interface RouterState {
  sidebarLevel: number
  defaultRoute: string
}

export type Permission = string

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

export interface UserState {
  permissions: Permission[]
  user: User | null
  loggedIn: boolean
}
