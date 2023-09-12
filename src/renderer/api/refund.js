import request from '@/utils/request'

// 分页查询退款订单列表
export function getRefundList(query) {
  return request({
      url: 'backendApi/refund/list',
      method: 'get',
      params: query
  })
}

// 查询订单信息
export function getRefundInfo(refundId) {
  return request({
    url: 'backendApi/refund/info/' + refundId,
    method: 'get'
  })
}

// 订单退款
export function doRefund(data) {
  return request({
      url: 'backendApi/refund/doRefund',
      method: 'post',
      data: data
  })
}

// 删除退款订单
export function deleteRefund(refundId) {
  return request({
    url: 'backendApi/refund/delete/' + refundId,
    method: 'get'
  })
}

// 保存退款订单
export function saveRefund(data) {
  return request({
    url: 'backendApi/refund/save',
    method: 'post',
    data: data
  })
}
