import React from 'react'
import { HashRouter as Router, Route, Redirect } from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import Index from './pages/index'

const homeChlidren = ['home', 'setting'].join('|')

function App() {
  return (
    <Router>
      <Intercept path={`/(${homeChlidren})?`} exact component={Index}></Intercept>
      <Route path="/login" exact component={Login}></Route>
      <Route path="/register" exact component={Register}></Route>
    </Router>
  )
}

function Intercept({ component: Component, ...rest }) {
  return (
    <Route {...rest} render={props => sessionStorage.getItem('token') ? <Component {...props}/> : <Redirect to='/login'/>}></Route>
  )
}

export default App