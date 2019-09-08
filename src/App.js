import React from 'react'
import { HashRouter as Router, Route, Redirect } from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import Index from './pages/index'
import EmailCheck from './pages/email-check'

const homeChlidren = ['home', 'setting'].join('|')

function App() {
  return (
    <Router>
      <Intercept path={`/(${homeChlidren})?`} exact component={Index}></Intercept>
      <Route path="/login" exact component={Login}></Route>
      <Route path="/register" exact component={Register}></Route>
      <EmailIntercept path="/email-check" exact component={EmailCheck}></EmailIntercept>
    </Router>
  )
}

function Intercept({ component: Component, ...rest }) {
  return (
    <Route {...rest} render={props => {
      if (!sessionStorage.getItem('token')) return <Redirect to='/login'/>
      if (sessionStorage.getItem('emailStatus') !== '1') return <Redirect to='/email-check'/>
      return <Component {...props}/>
    }}></Route>
  )
}

function EmailIntercept({ component: Component, ...rest }) {
  return (
    <Route {...rest} render={props => {
      if (!sessionStorage.getItem('token')) return <Redirect to='/login'/>
      if (sessionStorage.getItem('emailStatus') === '1') return <Redirect to='/'/>
      return <Component {...props}/>
    }}></Route>
  )
}

export default App