import React, { Component } from 'react'
import { Form, Input, message } from 'antd'
import './index.scss'
import { getForgotEmail } from '../../api'
import CountButton from '../../components/count-button'

class EmailForgot extends Component {
  sendEmail = async () => {
    try {
      const { username } = await this.validateFields()
      await getForgotEmail(username)
      message.success('邮件发送成功，请点击邮件中的链接进行重置密码操作')
    } catch (e) {
      return Promise.reject(e)
    }
  }
  validateFields = () => {
    return new Promise((resolve, reject) => {
      this.props.form.validateFields((err, values) => !err ? resolve(values) : reject())
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <section className="email-forgot-container">
        <img src={require('../../static/images/logo.png')} alt="logo"></img>
        <div className="form-container">
          <Form>
            <Form.Item label="用户名">
              {getFieldDecorator('username', {
                rules: [{ required: true,
                 message: '请输入用户名' }]
              })(<Input className="count-button-input" allowClear placeholder="请输入帐号/邮箱" addonAfter={<CountButton timing={600} clickBtn={this.sendEmail}></CountButton>}></Input>)}
            </Form.Item>
          </Form>
        </div>
      </section>
    )
  }
}

export default Form.create({
  name: 'email_forgot'
})(EmailForgot)