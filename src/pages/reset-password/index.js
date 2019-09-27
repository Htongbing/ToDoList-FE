import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd'
import './index.scss'
import { resetPassword } from '../../api'
import { PASSWORD_RE } from '../../const'

class ResetPassword extends Component {
  state = {
    loading: false,
    confirmDirty: false,
  }
  resetPassword = async () => {
    try {
      const { password } = await this.validateFields()
      this.setState({ loading: true })
      await resetPassword(password)
      message.success('操作成功')
      this.props.history.push('/login')
    } catch (e) {}
    this.state.loading && this.setState({ loading: false })
  }
  handleKeyUp = e => {
    if (e.keyCode !== 13 || this.state.loading) return
    this.resetPassword()
  }
  validateFields = () => {
    return new Promise((resolve, reject) => {
      this.props.form.validateFields((err, values) => !err ? resolve(values) : reject(err))
    })
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
  handleConfirmBlur = e => {
    this.setState({
      confirmDirty: this.state.confirmDirty || !!e.target.value
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <section className="reset-password-container">
        <img src={require('../../static/images/logo.png')} alt="logo"></img>
        <div className="form-container">
          <Form>
            <Form.Item label="密码">
              {getFieldDecorator('password', {
                rules: [
                  { required: true, validator: this.passwordValidate }
                ]
              })(<Input.Password onKeyUp={this.handleKeyUp} allowClear placeholder="请输入密码" />)}
            </Form.Item>
            <Form.Item label="确认密码">
              {getFieldDecorator('repeatPassword', {
                rules: [
                  { required: true, validator: this.repeatPasswordValidate }
                ]
              })(<Input.Password allowClear onKeyUp={this.handleKeyUp} onBlur={this.handleConfirmBlur} placeholder="请确认密码"/>)}
            </Form.Item>
            <Form.Item>
              <Button type="primary" block onClick={this.resetPassword} loading={this.state.loading}>确  定</Button>
            </Form.Item>
          </Form>
        </div>
      </section>
    )
  }
}

export default Form.create({
  name: 'reset_password'
})(ResetPassword)