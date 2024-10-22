import request from '@/utils/request'

// 分页查询员工列表
export function getStaffList(query) {
  return request({
      url: 'backendApi/staff/list',
      method: 'get',
      params: query
  })
}
