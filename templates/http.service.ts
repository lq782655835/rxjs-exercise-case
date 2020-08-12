import { Response } from '@/interfaces'
import _ from 'lodash'
import { Observable, of, throwError } from 'rxjs'
import { ajax, AjaxResponse } from 'rxjs/ajax'
import { map, switchMap } from 'rxjs/operators'
import { loginService } from './login.service'

/**
 * Http 服务
 */
export class HttpService {
  /**
   * 处理请求错误
   * @param response
   */
  static handleError(response: Response): Observable<Response> {
    /**
     * 30001 错误属于登录错误，需要重新登录
     */
    if (response.code === 30001) {
      loginService.login()
    } else if (response.code !== 200) {
      // code 非 200 抛错，由对应的处理函数处理
      return throwError(response)
    } else {
      return of(response)
    }
  }

  /**
   * 处理服务器错误（http status 非 200）
   */
  static handleServerError(res: AjaxResponse): Observable<AjaxResponse> {
    return of(res)
  }

  /**
   * 创建请求提
   * @param body
   */
  createRequestBody(body?: any) {
    if (body) {
      // 搜索字段需要 trim
      if (_.isString(body.searchKey)) {
        body.searchKey = body.searchKey.trim()
      }

      return {
        ...body
        // user: loginService.getUser()
      }
    }
  }

  /**
   * get 请求
   * @param url 请求路径
   * @param params 请求参数
   */
  get<T = any>(url: string, params?: Record<string, any>): Observable<Response<T>> {
    url = this.normalizeUrl(url, params)

    return ajax.get(url).pipe(
      switchMap(HttpService.handleServerError),
      map(res => res.response),
      switchMap(HttpService.handleError)
    )
  }

  /**
   * 处理路由
   * @param url 请求路径
   * @param params 请求参数
   */
  normalizeUrl(url: string, params: Record<string, any> = {}): string {
    const user = loginService.getUser()

    if (user) {
      params = Object.assign(
        {
          product: user.product,
          clusterId: user.clusterId
        },
        params
      )
    }

    const queryString = this.object2params(params)

    if (url.startsWith('http') || url.startsWith('/api')) {
      url += queryString
    } else {
      if (url[0] !== '/') {
        url = '/' + url
      }

      url = '/api' + url + queryString
    }

    return url
  }

  /**
   * 将对象转化成 url 参数
   * @param params 请求参数
   */
  object2params(params: Record<string, any>) {
    let queryString = ''

    const paramList: string[] = []
    Object.keys(params).forEach(key => {
      let value = params[key]

      if (key === 'searchKey' && _.isString(value)) {
        value = value.trim()
      }

      if (params[key] || _.isNumber(params[key])) {
        paramList.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      }
    })

    if (paramList.length > 0) {
      queryString += '?' + paramList.join('&')
    }

    return queryString
  }

  /**
   * post 请求
   * @param url 请求路径
   * @param body 请求参数
   */
  post<T = any>(url: string, body?: Record<string, any>): Observable<Response<T>> {
    url = this.normalizeUrl(url)
    body = this.createRequestBody(body)

    return ajax
      .post(url, body, {
        'content-type': 'application/json'
      })
      .pipe(
        switchMap(HttpService.handleServerError),
        map(res => res.response),
        switchMap(HttpService.handleError)
      )
  }
}

export const httpService = new HttpService()
