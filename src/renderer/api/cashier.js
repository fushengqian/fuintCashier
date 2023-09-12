import request from '@/utils/request'

// 初始化数据
export function init(userId) {
  return request({
      url: 'backendApi/cashier/init/' + userId,
      method: 'get'
  })
}

// 查询商品详情
export function getGoodsInfo(goodsId) {
  return request({
    url: 'backendApi/cashier/getGoodsInfo/' + goodsId,
    method: 'get'
  })
}

// 查询商品
export function searchGoods(data) {
  return request({
    url: 'backendApi/cashier/searchGoods',
    method: 'post',
    data: data
  })
}

// 查询会员信息
export function getMemberInfo(data) {
  return request({
    url: 'backendApi/cashier/getMemberInfo',
    method: 'post',
    data: data
  })
}

// 查询会员信息
export function getMemberInfoById(userId) {
  return request({
    url: 'backendApi/cashier/getMemberInfoById/' + userId,
    method: 'get'
  })
}

// 获取购物车列表
export function getCartList(data) {
  return request({
    url: 'clientApi/cart/list',
    method: 'post',
    data: data
  })
}

// 保存购物车
export function saveCart(data) {
  return request({
    url: 'clientApi/cart/save',
    method: 'post',
    data: data
  })
}

// 删除购物车
export function removeFromCart(data) {
  return request({
    url: 'clientApi/cart/clear',
    method: 'post',
    data: data
  })
}

// 提交结算
export function submitSettlement(data) {
  return request({
    url: 'clientApi/settlement/submit',
    method: 'post',
    data: data
  })
}

// 发起支付
export function doPay(params) {
  return request({
    url: 'clientApi/pay/doPay',
    method: 'get',
    params: params
  })
}

// 获取订单列表
export function getOrderList(data) {
  return request({
    url: 'backendApi/order/latest',
    method: 'post',
    data: data
  })
}

// 执行挂单
export function doHangUp(data) {
  return request({
    url: 'backendApi/cashier/doHangUp',
    method: 'post',
    data: data
  })
}

// 获取挂单
export function getHangUpList() {
  return request({
    url: 'backendApi/cashier/getHangUpList',
    method: 'get'
  })
}

// 删除挂单
export function removeHangUp(data) {
  return request({
    url: 'clientApi/cart/clear',
    method: 'post',
    data: data
  })
}
