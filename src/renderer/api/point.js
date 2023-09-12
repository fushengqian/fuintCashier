import request from '@/utils/request'

// 分页查询积分明细列表
export function getPointList(query) {
  return request({
      url: 'backendApi/point/list',
      method: 'get',
      params: query
  })
}

// 查询明细详情
export function getPointInfo(memberId) {
  return request({
    url: 'backendApi/point/info/' + memberId,
    method: 'get'
  })
}

// 更新状态
export function updatePointStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
      url: 'backendApi/point/updateStatus',
      method: 'post',
      data: data
  })
}

// 获取配置信息
export function getSettingInfo() {
  return request({
    url: 'backendApi/point/setting',
    method: 'get'
  })
}

// 保存配置
export function saveSetting(data) {
  return request({
    url: 'backendApi/point/saveSetting',
    method: 'post',
    data: data
  })
}

// 确定充值
export function doRecharge(data) {
  return request({
    url: 'backendApi/point/doRecharge',
    method: 'post',
    data: data
  })
}

