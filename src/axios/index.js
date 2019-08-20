import axios from 'axios'
import { notification } from 'antd'

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