import { request } from '@/utils/request'
import type {
  AllPermissions,
  CommonResponse,
  PermissionGroupInfo,
  PermissionGroupItem,
  PermissionGroupList,
  TablePage,
  UserListItem,
} from '@/utils/types'

export default class AdminModel {
  static getUsers(params: {
    count?: number
    page?: number
    group_id?: number
  }) {
    return request<TablePage<UserListItem>>({
      url: '/cms/admin/users',
      params,
    })
  }

  static changePassword(
    id: number,
    data: {
      new_password: string
      confirm_password: string
    },
  ) {
    return request<CommonResponse>({
      url: `cms/admin/user/${id}/password`,
      method: 'PUT',
      data,
    })
  }

  static updateOneUser(
    id: number,
    data: {
      email: string
      group_ids: number[]
    },
  ) {
    return request<CommonResponse>({
      url: `cms/admin/user/${id}`,
      method: 'PUT',
      data,
    })
  }

  static deleteOneUser(id: number) {
    return request({
      method: 'DELETE',
      url: `/cms/admin/user/${id}`,
    })
  }

  static getAllGroups() {
    return request<PermissionGroupList>({
      url: '/cms/admin/group/all',
    })
  }

  static updateOneGroup(group: PermissionGroupItem) {
    const { id, ...data } = group
    return request<CommonResponse>({
      url: `/cms/admin/group/${id}`,
      method: 'PUT',
      data,
    })
  }

  static deleteOneGroup(id: number) {
    return request<CommonResponse>({
      method: 'DELETE',
      url: `/cms/admin/group/${id}`,
    })
  }

  static getAllPermissions() {
    return request<AllPermissions>({
      url: '/cms/admin/permission',
    })
  }

  static getOneGroup(id: number | string) {
    return request<PermissionGroupInfo>({
      url: `cms/admin/group/${id}`,
    })
  }

  static dispatchPermissions(data: {
    group_id: number
    permission_ids: number[]
  }) {
    return request<CommonResponse>({
      method: 'POST',
      url: '/cms/admin/permission/dispatch/batch',
      data,
    })
  }

  static removePermissions(data: {
    group_id: number
    permission_ids: number[]
  }) {
    return request({
      method: 'POST',
      url: '/cms/admin/permission/remove',
      data,
    })
  }

  static createOneGroup(data: {
    name: string
    info: string
    permission_ids: number[]
  }) {
    return request<CommonResponse>({
      method: 'POST',
      url: '/cms/admin/group',
      data,
    })
  }
}
