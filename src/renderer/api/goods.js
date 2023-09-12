import request from '@/utils/request'

// 分页查询商品列表
export function getGoodsList(query) {
  return request({
      url: 'backendApi/goods/goods/list',
      method: 'get',
      params: query
  })
}

// 查询商品详情
export function getGoodsInfo(goodsId) {
  return request({
    url: 'backendApi/goods/goods/info/' + goodsId,
    method: 'get'
  })
}

// 更新状态
export function updateGoodsStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
      url: 'backendApi/goods/goods/updateStatus',
      method: 'post',
      data: data
  })
}

// 保存分类数据
export function saveGoods(data) {
  return request({
      url: 'backendApi/goods/goods/save',
      method: 'post',
      data: data
  })
}

// 保存商品规格名称
export function saveSpecName(data) {
  return request({
      url: 'backendApi/goods/goods/saveSpecName',
      method: 'post',
      data: data
  })
}

// 保存商品规格值
export function saveSpecValue(data) {
  return request({
      url: 'backendApi/goods/goods/saveSpecValue',
      method: 'post',
      data: data
  })
}

// 删除商品规格
export function deleteSpec(query) {
  return request({
      url: 'backendApi/goods/goods/deleteSpec',
      method: 'get',
      params: query
  })
}

// 删除商品规格值
export function deleteSpecValue(query) {
  return request({
      url: 'backendApi/goods/goods/deleteSpecValue',
      method: 'get',
      params: query
  })
}
