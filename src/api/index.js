import axios from '../axios'

export const login = ({username, password}) => 
  axios.post('/users/signIn', {
    username,
    password
  })