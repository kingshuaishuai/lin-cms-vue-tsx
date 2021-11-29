import { request } from '@/utils/request'
import type {
  AllPermissions,
  CommonResponse,
  PermissionGroupInfo,
  PermissionGroupItem,
  PermissionGroupList,
} from '@/utils/types'

export default class AdminModel {
  static async getAllGroups() {
    return request<PermissionGroupList>({
      url: '/cms/admin/group/all',
    })
  }

  static async updateOneGroup(group: PermissionGroupItem) {
    const { id, ...data } = group
    return request<CommonResponse>({
      url: `/cms/admin/group/${id}`,
      method: 'PUT',
      data,
    })
  }

  static async deleteOneGroup(id: number) {
    return await request<CommonResponse>({
      method: 'DELETE',
      url: `/cms/admin/group/${id}`,
    })
  }

  static async getAllPermissions() {
    return request<AllPermissions>({
      url: '/cms/admin/permission',
    })
  }

  static async getOneGroup(id: number | string) {
    return request<PermissionGroupInfo>({
      url: `cms/admin/group/${id}`,
    })
  }

  static async dispatchPermissions(data: {
    group_id: number
    permission_ids: number[]
  }) {
    return request<CommonResponse>({
      method: 'POST',
      url: '/cms/admin/permission/dispatch/batch',
      data,
    })
  }

  static async removePermissions(data: {
    group_id: number
    permission_ids: number[]
  }) {
    return request({
      method: 'POST',
      url: '/cms/admin/permission/remove',
      data,
    })
  }
}
