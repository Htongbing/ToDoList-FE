import React, { Component } from 'react'
import { Form, Button, Input, Spin, message } from 'antd'
import './index.scss'
import { register } from '../../api'
import { ACCOUNT_RE, PASSWORD_RE } from '../../const'

class Register extends Component {
  state = {
    verificationImgLoading: false,
    confirmDirty: false,
    loading: false
  }
  componentDidMount = () => {
    this.changeVerificationImg()
  }
  changeVerificationImg = () => {
    this.setState({ verificationImgLoading: true })
    this.verificationImg.setAttribute('src', `/codes?_=${Date.now()}${Math.random()}`)
  }
  closeImgLoading = () => {
    this.setState({ verificationImgLoading: false })
  }
  handleConfirmBlur = e => {
    this.setState({
      confirmDirty: this.state.confirmDirty || !!e.target.value
    })
  }
  handleKeyUp = e => {
    if (e.keyCode !== 13 || this.state.loading) return
    this.register()
  }
  accountValidate = (rule, value, callback) => {
    if (!value) return callback('请输入帐号')
    if (!ACCOUNT_RE.test(value)) return callback('帐号必须以字母开头，由字母或者数字组成，长度6-20')
    callback()
  }
  passwordValidate = (rule, value, callback) => {
    if (!value) return callback('请输入密码')
    this.state.confirmDirty && this.props.form.validateFields(['repeatPassword'])
    if (!PASSWORD_RE.test(value)) return callback('密码只能由数字和字母组成，且必须包含数字和字母，长度6-20')
    callback()
  }
  repeatPasswordValidate = (rule, value, callback) => {
    if (!value) return callback('请确认密码')
    if (value !== this.props.form.getFieldValue('password')) return callback('两次输入的密码不一致')
    callback()
  }
  validateFields = () => {
    return new Promise((resolve, reject) => {
      this.props.form.validateFields((err, values) => !err ? resolve(values) : reject(err))
    })
  }
  register = async () => {
    this.setState({ loading: true })
    try {
      const values = await this.validateFields()
      await register(values)
      message.success('注册成功')
      this.props.history.push('/login')
    } catch (e) {
      e instanceof Error && this.changeVerificationImg()
      this.state.loading && this.setState({ loading: false })
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <section className="register-wrap">
        <section className="register-container">
          <img src={require('../../static/images/logo.png')} alt="logo"></img>
          <div className="form-container">
            <Form>
              <Form.Item label="帐号">
                {getFieldDecorator('account', {
                  rules: [
                    { required: true, validator: this.accountValidate }
                  ]
                })(<Input onKeyUp={this.handleKeyUp} allowClear placeholder="请输入帐号"/>)}
              </Form.Item>
              <Form.Item label="邮箱">
                {getFieldDecorator('email', {
                  rules: [
                    { type: 'email', message: '请输入正确的邮箱地址' },
                    { required: true, message: '请输入邮箱地址' }
                  ]
                })(<Input onKeyUp={this.handleKeyUp} allowClear placeholder="请输入邮箱"/>)}
              </Form.Item>
              <Form.Item label="密码">
                {getFieldDecorator('password', {
                  rules: [
                    { required: true, validator: this.passwordValidate }
                  ]
                })(<Input.Password onKeyUp={this.handleKeyUp} allowClear placeholder="请输入密码"/>)}
              </Form.Item>
              <Form.Item label="确认密码">
                {getFieldDecorator('repeatPassword', {
                  rules: [
                    { required: true, validator: this.repeatPasswordValidate }
                  ]
                })(<Input.Password allowClear onKeyUp={this.handleKeyUp} onBlur={this.handleConfirmBlur} placeholder="请确认密码"/>)}
              </Form.Item>
              <Form.Item label="验证码">
                {getFieldDecorator('verification_code', {
                  rules: [{ required: true, message: '请输入验证码' }]
                })(<Input onKeyUp={this.handleKeyUp} allowClear placeholder="请输入验证码，不区分大小写"/>)}
              </Form.Item>
              <Form.Item>
                <Spin spinning={this.state.verificationImgLoading}>
                  <div className="verification-container">
                    <img src="/codes" alt="验证码" ref={verificationImg => this.verificationImg = verificationImg} onLoad={this.closeImgLoading} onError={this.closeImgLoading}></img>
                    <span onClick={this.changeVerificationImg}>看不清？换一张</span>
                  </div>
                </Spin>
                <Button type="primary" block onClick={this.register} loading={this.state.loading}>注  册</Button>
                <div className="link-container">
                  <a href="#/login">已有帐号？立即登录</a>
                </div>
              </Form.Item>
            </Form>
          </div>
        </section>
      </section>
    )
  }
}

export default Form.create({
  name: 'register_form'
})(Register)