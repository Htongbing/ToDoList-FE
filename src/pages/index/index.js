import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Home from './home'
import Setting from './setting'
import { Layout, Icon, Popconfirm } from 'antd'
import './index.scss'
const { Header, Content } = Layout

class Index extends Component {
  state = {
    username: sessionStorage.getItem('username'),
    routes: [
      {
        path: '/home',
        name: '首页',
        component: Home
      },
      {
        path: '/setting',
        name: '设置',
        component: Setting
      }
    ]
  }
  jump = path => {
    const { location, history } = this.props
    location.pathname !== path && history.push(path)
  }
  logout = () => {
    sessionStorage.removeItem('token')
    this.props.history.push('/login')
  }
  componentDidMount() {
    this.jump('/home')
  }
  render() {
    const { location } = this.props
    const { routes, username } = this.state
    return (
      <Layout className="index-container">
        <Header className="index-header">
          <img src={require('../../static/images/logo.png')} alt="logo"></img>
          <ul className="nav">
            {
              routes.map(({path, name}) => (
                <li key={path} className={location.pathname === path ? 'active' : ''} onClick={() => { this.jump(path) }}>{name}</li>
              ))
            }
          </ul>
          <div className="user-container">
            <img src={require('../../static/images/head.jpg')} alt="头像"></img>
            <span className="username">{username}</span>
            <Popconfirm title="确定要退出登录吗？" onConfirm={this.logout} okText="确定" cancelText="取消" placement="bottomRight">
              <Icon type="logout" />
            </Popconfirm>
          </div>
        </Header>
        <Content className="index-content">
          {
            routes.map(({path, component}) => (
              <Route key={path} path={path} exact component={component}></Route>
            ))
          }
          <img src={require('../../static/images/logo.png')} className={location.pathname === '/' ? 'show' : ''} alt="logo"></img>
        </Content>
      </Layout>
    )
  }
}

export default Index