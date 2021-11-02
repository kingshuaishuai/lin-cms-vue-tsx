import { Permission, User } from '@/store/type'
import { RouterRecordDesc } from './types'

interface ObjWithOrder {
  order: number | undefined | null
}

export function sortByOrder<T extends ObjWithOrder = ObjWithOrder>(
  source: T[],
): T[] {
  if (!source.length) return source

  const { orderMap, noOrderList } = groupedByOrder<T>(source)
  const orders = Array.from(orderMap.keys()).sort((a, b) => a - b)
  const orderedList = orders.map((o) => orderMap.get(o)!).flat()

  return orderedList.concat(noOrderList)
}

function groupedByOrder<T extends ObjWithOrder = ObjWithOrder>(source: T[]) {
  const orderMap = new Map<number, T[]>()
  const noOrderList: T[] = []

  source.forEach((item) => {
    const { order } = item
    if (typeof order !== 'number') {
      noOrderList.push(item)
      return
    }
    if (!orderMap.has(order)) {
      orderMap.set(order, [item])
    } else {
      orderMap.get(order)!.push(item)
    }
  })

  return {
    orderMap,
    noOrderList,
  }
}

export function deepReduceName(target: RouterRecordDesc | RouterRecordDesc[]) {
  if (Array.isArray(target)) {
    target.forEach((item) => {
      // 数组套数组的不处理
      if (typeof item !== 'object') return
      deepReduceName(item)
    })
    return
  }

  if (typeof target.name !== 'symbol') {
    target.name = target.name.trim() || getRandomStr()
    target.name = Symbol(target.name)
  }
  // if (!target.name.trim()) {
  //   target.name = target.name.trim() || getRandomStr()
  // }

  if (target.children?.length) {
    deepReduceName(target.children)
  }
}

export const getRandomStr = (n = 6) => {
  let str = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
  for (let i = 0; i < n; i += 1) {
    str += chars.charAt(Math.floor(Math.random() * 62))
  }
  return str
}

export const hasPermission = (
  permissions: Permission[],
  route: RouterRecordDesc | { permission?: string[] },
  user: User | null,
) => {
  if (!user) {
    return false
  }
  if (user.admin) {
    return true
  }
  if (route.permission) {
    return permissions.some(
      (permission) => route.permission!.indexOf(permission) > -1,
    )
  }
  return true
}
