import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { merge } from 'lodash'
import { message as AntMessage } from 'ant-design-vue'
import { getToken, saveTokens } from './token'
import Config from '@/config'
import ErrorCode from '@/config/errorCode'
import { useUserStore } from '@/store/user'

declare module 'axios' {
  interface AxiosRequestConfig<D = any> {
    handleError?: boolean
    showBackend?: boolean
  }
}

function isObject(obj: any): obj is Object {
  return (
    obj !== null && Object.prototype.toString.call(obj) === '[object Object]'
  )
}

/**
 * 错误码是否是refresh相关
 * @param { number } code 错误码
 */
function refreshTokenException(code: number) {
  const codes = [10000, 10042, 10050, 10052]
  return codes.includes(code)
}

const axiosDefaultConfig: AxiosRequestConfig = {
  baseURL: 'http://localhost:3010',
  validateStatus: (status) => status >= 200 && status < 510,
}

export const createAxiosInstance = (config: AxiosRequestConfig) => {
  const instance = Axios.create(merge(axiosDefaultConfig, config))

  instance.interceptors.request.use(
    (originConfig) => {
      // TODO: 无请求之后定时退出
      const requestConfig: AxiosRequestConfig = {
        ...originConfig,
      }
      if (!requestConfig.url) {
        console.error('request need url')
      }

      // headers 中添加 token
      const url = `/${requestConfig.url}`.replaceAll('//', '/')
      if (url === '/cms/user/refresh') {
        const refreshToken = getToken('refresh_token')
        if (refreshToken) {
          requestConfig.headers = {
            ...requestConfig.headers,
            Authorization: refreshToken,
          }
        }
      } else {
        const accessToken = getToken('access_token')
        if (accessToken) {
          requestConfig.headers = {
            ...requestConfig.headers,
            Authorization: accessToken,
          }
        }
      }
      return requestConfig
    },
    (err) => Promise.reject(err),
  )

  instance.interceptors.response.use(
    async (res) => {
      if (res.status.toString().charAt(0) === '2') return res

      const { code, message } = res.data
      return new Promise(async (resolve, reject) => {
        let tipMessage = ''

        // refresh token异常
        if (refreshTokenException(code)) {
          const userStore = useUserStore()

          if (!res.config.handleError) {
            AntMessage.error(message || '令牌过期')
          }
          setTimeout(() => {
            userStore.logout()
            window.location.reload()
          }, 1500)
          return reject(res)
        }

        // 刷新Token
        if (code === 10041 || code === 10051) {
          const tokens = await instance.get<{
            access_token: string
            refresh_token: string
          }>('/cms/user/refresh')
          saveTokens(tokens.data.access_token, tokens.data.refresh_token)
          const result = instance.request(res.config)
          return resolve(result)
        }

        // 弹出信息提示的第一种情况：直接提示后端返回的异常信息（框架默认为此配置）；
        // 特殊情况：将错误处理交还给用户，不走默认处理。
        // 如果本次请求添加了 handleError: true，用户自行通过 try catch 处理，框架不做额外处理
        if (res.config.handleError) {
          return reject(res)
        }

        // 弹出信息提示的第二种情况：采用前端自己定义的一套异常提示信息（需自行在配置项开启）；
        // 特殊情况：如果本次请求添加了 showBackend: true, 弹出后端返回错误信息。
        if (Config.useFrontEndErrorMsg && !res.config.showBackend) {
          // 弹出前端自定义错误信息
          const errorArr = Object.entries(ErrorCode).filter(
            ([c]) => c === code.toString(),
          )
          // 匹配到前端自定义的错误码
          if (errorArr.length > 0 && errorArr[0][1] !== '') {
            tipMessage = errorArr[0][1]
          } else {
            tipMessage = ErrorCode['777']
          }
        }
        if (typeof message === 'string') {
          tipMessage = message
        }
        if (isObject(message)) {
          tipMessage = (Object.values(message).flat() as string[])[0]
        }
        if (Array.isArray(message)) {
          tipMessage = message[0]
        }
        AntMessage.error(tipMessage)
        return reject(res)
      })
    },
    (error) => {
      if (!error.response) {
        AntMessage.error('请检查 API 是否异常')
      }
      // 判断请求超时
      if (
        error.code === 'ECONNABORTED' &&
        error.message.indexOf('timeout') !== -1
      ) {
        AntMessage.warning('请求超时')
      }
      return Promise.reject(error)
    },
  )
  return instance
}

export const getRequest = (instance: AxiosInstance) => {
  return <T = any>(config: AxiosRequestConfig) =>
    instance.request<T>(config).then((res) => res.data)
}

const defaultAxiosInstance = createAxiosInstance({})
const defaultRequest = getRequest(defaultAxiosInstance)

export { defaultAxiosInstance, defaultRequest as request }
