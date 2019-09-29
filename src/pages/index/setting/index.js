import React, { Component } from 'react'
import { Form, Radio, TimePicker, Button, message, Icon } from 'antd'
import { setUserSetting, getUserSetting } from '../../../api'
import './index.scss'
import moment from 'moment'

class Setting extends Component {
  state = {
    needNotice: 0,
    loading: false,
    btnLoading: false,
    noticeTime: null
  }
  componentDidMount = () => {
    this.getUserSetting()
  }
  timeValidate = (rule, value, cb) => !!this.state.needNotice && !value ? cb(new Error()) : cb()
  changeRadio = ({ target: { value } }) => {
    this.setState({ needNotice: value }, () => {
      const form = this.props.form
      !value && form.setFieldsValue({ noticeTime: null })
      form.validateFields(['noticeTime'], () => {})
    })
  }
  getUserSetting = async () => {
    this.setState({ loading: true })
    try {
      const { needNotice, noticeTime } = await getUserSetting()
      this.setState({ needNotice, noticeTime })
    } catch (e) {}
    this.setState({ loading: false })
  }
  verify = () => {
    return new Promise((resolve, reject) => {
      this.props.form.validateFields((errors, values) => errors ? reject() : resolve(values))
    })
  }
  save = async () => {
    try {
      const values = await this.verify()
      values.noticeTime = values.noticeTime && moment(values.noticeTime).format('HH:mm')
      this.setState({ btnLoading: true })
      await setUserSetting(values)
      message.success('操作成功')
      this.setState({ btnLoading: false })
    } catch (e) {
      e instanceof Error && this.setState({ btnLoading: false })
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { needNotice, btnLoading, loading, noticeTime } = this.state
    return (
      <section className="setting-container">
        <Form>
          <Form.Item label="是否提醒" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
            {getFieldDecorator('needNotice', {
              initialValue: needNotice,
              rules: [
                { required: true }
              ]
            })(<Radio.Group onChange={this.changeRadio}>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>)}
          </Form.Item>
          <Form.Item label="提醒时间" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
            {getFieldDecorator('noticeTime', {
              initialValue: noticeTime && moment(noticeTime, 'HH:mm'),
              rules: [
                { required: true, message: '请选择时间', validator: this.timeValidate }
              ]
            })(<TimePicker disabled={!needNotice} format="HH:mm"></TimePicker>)}
          </Form.Item>
          <Form.Item>
            <section className="button-container">
              <Button type="primary" loading={btnLoading} onClick={this.save}>保存</Button>
            </section>
          </Form.Item>
        </Form>
        <section className={`loading-container${loading ? '' : ' hide'}`}>
          <Icon type="loading" />
        </section>
      </section>
    )
  }
}

export default Form.create({
  name: 'setting_form'
})(Setting)