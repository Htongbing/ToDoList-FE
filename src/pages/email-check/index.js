import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd'
import './index.scss'
import { verifyEmail, sendCode } from '../../api'
import CountButton from '../../components/count-button'

class EmailCheck extends Component {
  state = {
    loading: false,
    sendLoading: false
  }
  sendCode = async () => {
    try {
      this.setState({ sendLoading: true })
      await sendCode()
    } catch (e) {
      return Promise.reject(e)
    } finally {
      this.setState({ sendLoading: false })
    }
  }
  handleKeyUp = e => {
    if (e.keyCode !== 13 || this.state.loading) return
    this.verifyCode()
  }
  validateFields = () => {
    return new Promise((resolve, reject) => {
      this.props.form.validateFields((err, values) => !err ? resolve(values) : reject(err))
    })
  }
  verifyCode = async () => {
    try {
      const { code } = await this.validateFields()
      this.setState({ loading: true })
      const { token } = await verifyEmail(code)
      message.success('验证成功')
      sessionStorage.setItem('token', token)
      sessionStorage.setItem('emailStatus', '1')
      this.props.history.push('/home')
    } catch (e) {
      e instanceof Error && this.setState({ loading: false })
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <section className="email-check-container">
        <img src={require('../../static/images/logo.png')} alt="logo"></img>
        <div className="form-container">
          <Form>
            <Form.Item label="邮箱验证码">
              {getFieldDecorator('code', {
                rules: [{ required: true,
                 message: '请输入邮箱验证码' }]
              })(<Input className="count-button-input" onKeyUp={this.handleKeyUp} allowClear placeholder="请输入邮箱验证码" addonAfter={<CountButton clickBtn={this.sendCode} immediately></CountButton>}></Input>)}
            </Form.Item>
            <Form.Item>
              <Button type="primary" block onClick={this.verifyCode} loading={this.state.loading} disabled={this.state.sendLoading}>确  定</Button>
            </Form.Item>
          </Form>
        </div>
      </section>
    )
  }
}

export default Form.create({
  name: 'email_check'
})(EmailCheck)