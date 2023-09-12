import axios from 'axios'
import { Notification, Message } from 'element-ui'
import { getToken } from '@/utils/auth'

const serves = axios.create({
  baseURL: process.env.userConfig.API_HOST,
  timeout: 5000
})

// 设置请求发送之前的拦截器
serves.interceptors.request.use(config => {
  // 设置发送之前数据需要做什么处理
  if (getToken()) {
      config.headers['Access-Token'] = getToken();
  }
  config.headers['platform'] = 'PC';
  return config
}, err => Promise.reject(err))

// 设置请求响应拦截器
serves.interceptors.response.use(res => {
  // 响应代码
  const code = res.data.code || 200;
  // 获取错误信息
  const msg = res.data.message || "未知错误";

  if (code === 500) {
      Message.error(res.data.data);
  } else if (code !== 200) {
      Notification.error({
        title: msg
      })
      return Promise.reject('error');
  } else {
      return res.data;
  }
}, error => {
    console.log('err' + error)
    let { message } = error;
    if (message == "Network Error") {
        message = "后端接口连接异常";
    }
    else if (message.includes("timeout")) {
        message = "系统接口请求超时";
    }
    else if (message.includes("Request failed with status code")) {
        message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    Message({
        message: message,
        type: 'error',
        duration: 5 * 1000
    })
    return Promise.reject(error);
})

// 将serves抛出去
export default serves
