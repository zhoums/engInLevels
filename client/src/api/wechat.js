import request from '@/utils/request'

export function setMenu(params) {
  console.log('wechat',params)
  return request({
    url: '/setmenu',
    method: 'post',
    data:params
  })
}
