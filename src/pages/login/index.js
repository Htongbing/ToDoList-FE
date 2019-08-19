import React, { Component } from 'react'
import { Form, Input, Icon, Button } from 'antd'
import './index.scss'
import { login } from '../../api'

class Login extends Component {
  state = {
    loading: false
  }
  validateFields = () => {
    return new Promise((resolve, reject) => {
      this.props.form.validateFields((err, values) => !err ? resolve(values) : reject(err))
    })
  }
  handleKeyUp = e => {
    if (e.keyCode !== 13 || this.state.loading) return
    this.login()
  }
  login = async () => {
    this.setState({ loading: true })
    try {
      const values = await this.validateFields()
      const { token } = await login(values)
      console.log(token)
    } catch (e) {}
    this.setState({ loading: false })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <section className="login-container">
        <img src={require('../../static/images/logo.png')} alt="logo"></img>
        <div className="form-container">
          <Form className="login-form">
            <Form.Item label="用户名">
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入用户名' }]
              })(<Input onKeyUp={this.handleKeyUp} prefix={<Icon type="user" style={{ color: 'rgba(0, 0, 0, .25)' }}></Icon>} allowClear placeholder="请输入帐号/邮箱"/>)}
            </Form.Item>
            <Form.Item label="密码">
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }]
              })(<Input.Password onKeyUp={this.handleKeyUp} prefix={<Icon type="lock" style={{ color: 'rgba(0, 0, 0, .25)' }}></Icon>} allowClear placeholder="请输入密码"/>)}
            </Form.Item>
            <Form.Item>
              <div className="link-container right">
                <a href="/forgot-password">忘记密码</a>
              </div>
              <Button type="primary" block onClick={this.login} loading={this.state.loading}>登  录</Button>
              <div className="link-container">
                <a href="#/register">没有帐号？立即注册</a>
              </div>
            </Form.Item>
          </Form>
        </div>
      </section>
    )
  }
}

export default Form.create({
  name: 'login_form'
})(Login);
