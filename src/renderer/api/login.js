import request from '@/utils/request'

// 登录方法
export function login(username, password, captchaCode, uuid) {
  const data = {
    username,
    password,
    captchaCode,
    uuid
  }
  return request({
    url: 'backendApi/login/doLogin',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: 'backendApi/login/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: 'backendApi/login/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: 'clientApi/captcha/getCode',
    method: 'get'
  })
}

// 系统消息
export function message () {
  return request({
    url: 'clientApi/captcha/message',
    method: 'get'
  })
}
