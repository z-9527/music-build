import 'whatwg-fetch'
import { isAuthenticated, logout } from './Session'
import history from '../customHistory'

const error = {status: 0, msg: '网络错误'}
const loginError = {status: 0, msg: '登陆错误'}
const project = process.env.REACT_APP_PROJECT_NAME
const config=require(`@/${project}/config`).default

//判断域名是否存在，若存在返回url本身，否拼接配置路由及url
function isURL (str_url) {
    var strRegex= /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62}|(:[0-9]{1,4}))+\.?/
    var urlRule=new RegExp(strRegex)
    if (urlRule.test(str_url)) {
        return str_url;
    }
    return `${config.apiUrl}`+ str_url;
}

export async function get (url, param) {
  try {
    if (param) {
      url = `${isURL(url)}?${_encodeParam(param)}`
    }
    const response = await fetch(isURL(url), {
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json',
        'x-access-token': isAuthenticated(),
      })
    })
    if (response.status === 401) {
      // message.error("登陆错误")
      logout()
      history.replace('/login')
      return loginError
    }
    const result = await response.json()
    if (response.status >= 400) {
      // message.error("请求异常1")
      return result
    }
    return result
  } catch (err) {
    return error
  }
}

export async function post (url, param) {
  try {
    const response = await fetch(isURL(url), {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: _encodeParam(param),
    })
    if (response.status === 401) {
      // message.error("登陆错误")
      logout()
      history.replace('/login')
      return loginError
    }
    const result = await response.json()
    if (response.status >= 400) {
      // message.error("请求异常2")
      return result
    }
    return result
  } catch (err) {
    return error
  }
}

async function _json (url, json, method) {
  try {
    const response = await fetch(isURL(url), {
      credentials: 'include',
      method: method,
      headers: new Headers({
        'Content-Type': 'application/json',
        'x-access-token': isAuthenticated(),
      }),
      body: JSON.stringify(json),
    })
    if (response.status === 401) {
      // message.error("登陆错误")
      return loginError
    }
    const result = await response.json()
    if (response.status >= 400) {
      // message.error("请求异常3")
      return result
    }
    return result
  } catch (err) {
    return error
  }
}

export const json = {
  get: async function (url, param) {
    return get(isURL(url), param)
  },
  post: async function (url, json) {
    return _json(isURL(url), json, 'POST')
  },
  put: async function (url, json) {
    return _json(isURL(url), json, 'PUT')
  },
  delete: async function (url) {
    return _json(isURL(url), {}, 'DELETE')
  },
  batchDelete: async function (url, json) {
    return _json(isURL(url), json, 'DELETE')
  },
  isError: function (res) {
    if (res && res.status === 0) {
      return true
    }
    return false
  },
}

function _encodeParam (param) {
  return Object.keys(param)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(param[key] ? param[key] : '')}`)
    .join('&')
}

export function getSessionHeader()  {
  return {
    'x-access-token': isAuthenticated()
  }
}