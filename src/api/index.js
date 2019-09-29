import axios from '../axios'

export const login = ({username, password}) => 
  axios.post('/users/signIn', {
    username,
    password
  })

export const register = ({account, password, email, verification_code}) => 
  axios.post('/users/signUp', {
    account,
    password,
    email,
    verification_code
  })

export const sendCode = () => axios.post('/email/sendCode')

export const verifyEmail = code => axios.post('/email/verify', { code })

export const getTaskList = params => axios.get('/tasks', { params })

export const createTask = data => axios.post('/tasks', data)

export const updateTask = ({id, data}) => axios.put(`/tasks/${id}`, data)

export const deleteTasks = ids => axios.delete(`/tasks/${ids}`)

export const finishTask = id => axios.post('/tasks/finish', { id })

export const getStatistics = params => axios.get('/tasks/statistics', { params })

export const getUserSetting = () => axios.get('/users/noticeSetting')

export const setUserSetting = data => axios.put('/users/noticeSetting', data)

export const getForgotEmail = username => axios.post('/email/forgot', { username })

export const resetPassword = password => axios.put('/users/resetPassword', { password })