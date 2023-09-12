import request from '@/utils/request'

// 分页查询会员列表
export function getMemberList(query) {
  return request({
      url: 'backendApi/member/list',
      method: 'get',
      params: query
  })
}

// 查询会员信息
export function getMemberInfo(memberId) {
  return request({
    url: 'backendApi/member/info/' + memberId,
    method: 'get'
  })
}

// 查询会员设置
export function getMemberSetting() {
  return request({
    url: 'backendApi/member/setting',
    method: 'get'
  })
}

// 保存会员设置
export function saveSetting(data) {
  return request({
    url: 'backendApi/member/saveSetting',
    method: 'post',
    data: data
  })
}

// 更新会员状态
export function updateMemberStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
      url: 'backendApi/member/updateStatus',
      method: 'post',
      data: data
  })
}

// 删除会员信息
export function deleteMember(memberId) {
  return request({
    url: 'backendApi/member/delete/' + memberId,
    method: 'get'
  })
}

// 保存数据
export function saveMember(data) {
  return request({
    url: 'backendApi/member/save',
    method: 'post',
    data: data
  })
}
