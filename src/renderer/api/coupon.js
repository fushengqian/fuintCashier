import request from '@/utils/request'

// 分页查询卡券列表
export function getCouponList(query) {
  return request({
      url: 'backendApi/coupon/list',
      method: 'get',
      params: query
  })
}

// 查询卡券信息
export function getCouponInfo(id) {
  return request({
    url: 'backendApi/coupon/info/' + id,
    method: 'get'
  })
}

// 更新状态
export function updateCouponStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
      url: 'backendApi/coupon/updateStatus',
      method: 'post',
      data: data
  })
}

// 删除卡券
export function deleteCoupon(id) {
  return request({
    url: 'backendApi/coupon/delete/' + id,
    method: 'get'
  })
}

// 保存卡券
export function saveCoupon(data) {
  return request({
    url: 'backendApi/coupon/save',
    method: 'post',
    data: data
  })
}

// 查询卡券核销信息
export function getConfirmInfo(data) {
  return request({
    url: 'backendApi/doConfirm/info',
    method: 'post',
    data: data
  })
}

// 执行核销
export function doConfirm(data) {
  return request({
    url: 'backendApi/doConfirm/doConfirm',
    method: 'post',
    data: data
  })
}

// 发放卡券
export function sendCoupon(params) {
  return request({
    url: 'backendApi/coupon/sendCoupon',
    method: 'get',
    params: params
  })
}
