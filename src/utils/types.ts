import { VNodeChild } from 'vue'
import { IconName } from '@/components/base/Icon/type'
import { RouteRecordName, _RouteRecordBase, RouteComponent } from 'vue-router'

export type VueNode = VNodeChild | JSX.Element

export enum ROUTER_TYPE {
  FOLDER = 'FOLDER',
  TAB = 'TAB',
  VIEW = 'VIEW',
  HIDE = 'HIDE',
}

export interface RouterRecordDesc {
  name: RouteRecordName
  title: string
  type: ROUTER_TYPE
  route: string
  icon: IconName
  inNav: boolean
  component?: RouteComponent // vite 动态引入仅支持以相对路径开始的路径，因此此处直接引入组件
  order?: number
  children?: RouterRecordDesc[]
  permission?: string[]
}

export interface PermissionGroupItem {
  id: number
  name: string
  info: string
}

export type PermissionGroupList = PermissionGroupItem[]

export interface CommonResponse {
  code: number
  message: string
  request: string
}

export interface ModulePermissionItem {
  id: number
  name: string
  module: string
}

export type ModulePermissions = Array<ModulePermissionItem>

export interface AllPermissions {
  [key: string]: ModulePermissions
}

export interface PermissionGroupInfo {
  id: number
  info: string
  name: string
  permissions: ModulePermissions
}
