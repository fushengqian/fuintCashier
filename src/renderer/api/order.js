import request from '@/utils/request'

// 分页查询订单列表
export function getOrderList(data) {
  return request({
      url: 'backendApi/order/list',
      method: 'post',
      data: data
  })
}

// 查询订单信息
export function getOrderInfo(orderId) {
  return request({
    url: 'backendApi/order/info/' + orderId,
    method: 'get'
  })
}

// 更新订单状态
export function updateOrderStatus(orderId, status) {
  const data = {
    orderId,
    status
  }
  return request({
      url: 'backendApi/order/updateStatus',
      method: 'post',
      data: data
  })
}

// 删除订单
export function deleteOrder(orderId) {
  return request({
    url: 'backendApi/order/delete/' + orderId,
    method: 'get'
  })
}

// 保存订单数据
export function saveOrder(data) {
  return request({
    url: 'backendApi/order/save',
    method: 'post',
    data: data
  })
}

// 验证核销订单
export function verifyOrder(data) {
  return request({
    url: 'backendApi/order/verify',
    method: 'post',
    data: data
  })
}

// 提交发货信息
export function delivered(data) {
  return request({
    url: 'backendApi/order/delivered',
    method: 'post',
    data: data
  })
}

// 获取配置信息
export function getSettingInfo() {
  return request({
    url: 'backendApi/order/setting',
    method: 'get'
  })
}

// 保存配置
export function saveSetting(data) {
  return request({
    url: 'backendApi/order/saveSetting',
    method: 'post',
    data: data
  })
}
