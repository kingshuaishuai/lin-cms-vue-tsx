import { VNodeChild } from 'vue'
import { IconName } from '@/components/base/Icon/type'
import { RouteRecordName, _RouteRecordBase, RouteComponent } from 'vue-router'

export type VueNode = VNodeChild | JSX.Element

export enum ROUTER_TYPE {
  FOLDER = 'FOLDER',
  TAB = 'TAB',
  VIEW = 'VIEW',
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
