import React from 'react'
import { HashRouter as Router, Route, Redirect } from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'

function App() {
  return (
    <Router>
      <Route path="/" exact render={() => <Redirect to="/login"></Redirect>}></Route>
      <Route path="/login" component={Login}></Route>
      <Route path="/register" component={Register}></Route>
    </Router>
  )
}

export default App