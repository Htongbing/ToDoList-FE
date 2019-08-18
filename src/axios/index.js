import axios from 'axios'

axios.interceptors.response.use(function (response) {
  const { code, data, message } = response.data
  if (code === 0) {
    console.log(data)
    return Promise.resolve(data)
  }
  console.log(message)
  return Promise.reject(message)
}, function (error) {
  console.log(error)
  return Promise.reject(error)
})

export default axios