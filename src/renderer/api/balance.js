import request from '@/utils/request'

// 分页查询余额明细列表
export function getBalanceList(query) {
  return request({
      url: 'backendApi/balance/list',
      method: 'get',
      params: query
  })
}

// 查询明细详情
export function getBalanceInfo(memberId) {
  return request({
    url: 'backendApi/balance/info/' + memberId,
    method: 'get'
  })
}

// 更新状态
export function updateBalanceStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
      url: 'backendApi/balance/updateStatus',
      method: 'post',
      data: data
  })
}

// 获取配置信息
export function getSettingInfo() {
  return request({
    url: 'backendApi/balance/setting',
    method: 'get'
  })
}

// 保存配置
export function saveSetting(data) {
  return request({
    url: 'backendApi/balance/saveSetting',
    method: 'post',
    data: data
  })
}

// 确定充值
export function doRecharge(data) {
  return request({
    url: 'backendApi/balance/doRecharge',
    method: 'post',
    data: data
  })
}

