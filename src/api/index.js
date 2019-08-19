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
