import { User } from '@/store/types'
import { request } from '@/utils/request'
import { saveTokens } from '@/utils/token'

export interface GetTokenResult {
  access_token: string
  refresh_token: string
}

export default class UserModel {
  static async getToken(data: { username: string; password: string }) {
    const tokens = await request<GetTokenResult>({
      url: '/cms/user/login',
      method: 'POST',
      data,
    })
    saveTokens(tokens.access_token, tokens.refresh_token)
    return tokens
  }

  static async getPermissions() {
    const info = await request<User>({
      url: 'cms/user/permissions',
    })
    return info
  }
}
