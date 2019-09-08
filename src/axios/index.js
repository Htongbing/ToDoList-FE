import axios from 'axios'
import { notification } from 'antd'

axios.interceptors.request.use(function(config) {
  config.headers.Authorization = `Bearer ${sessionStorage.getItem('token') || ''}`;
  const { url } = config
  const userId = `userId=${sessionStorage.getItem('userId') || ''}`
  config.url += url.indexOf('?') > -1 ? `&${userId}` : `?${userId}`
  return config
})

axios.interceptors.response.use(function (response) {
  const { code, data, message } = response.data
  if (code === 0) {
    return Promise.resolve(data)
  }
  notification.error({
    message: '请求失败',
    description: message,
    duration: 2
  })
  if (code === 403) {
    Promise.resolve().then(() => {
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('emailStatus')
      window.location.reload()
    })
  }
  return Promise.reject(new Error(message))
}, function (error) {
  console.log(error)
  notification.error({
    message: '请求失败',
    description: '系统维护中，请稍后重试',
    duration: 2
  })
  return Promise.reject(error)
})

export default axios