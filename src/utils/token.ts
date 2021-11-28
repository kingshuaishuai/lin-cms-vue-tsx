/**
 * 存储tokens
 * @param accessToken
 * @param refreshToken
 */
export function saveTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('access_token', `Bearer ${accessToken}`)
  localStorage.setItem('refresh_token', `Bearer ${refreshToken}`)
}

/**
 * 存储access_token
 * @param accessToken
 */
export function saveAccessToken(accessToken: string) {
  localStorage.setItem('access_token', `Bearer ${accessToken}`)
}

/**
 * 获得某个token
 * @param tokenKey
 */
export function getToken(tokenKey: 'access_token' | 'refresh_token') {
  return localStorage.getItem(tokenKey)
}

/**
 * 移除token
 */
export function removeToken() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}
