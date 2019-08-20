import React, { Component } from 'react'
import { Form, Input, Select, DatePicker } from 'antd'
import './index.scss'

const { Option } = Select
const STATUS = [
  {
    label: '未开始',
    value: 0
  },
  {
    label: '进行中',
    value: 1
  },
  {
    label: '已完成',
    value: 2
  }
]

class Search extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <section className="search-container">
        <Form layout="inline">
          <Form.Item label="任务名称">
            {getFieldDecorator('name')(<Input allowClear placeholder="请输入"/>)}
          </Form.Item>
          <Form.Item label="任务状态">
            {getFieldDecorator('status')(<Select allowClear placeholder="请选择">
              {
                STATUS.map(({label, value}) => (
                  <Option key={value} value={value}>{label}</Option>
                ))
              }
            </Select>)}
          </Form.Item>
          <Form.Item label="创建时间">
            {getFieldDecorator('createdTime')(<DatePicker.RangePicker allowClear></DatePicker.RangePicker>)}
          </Form.Item>
        </Form>
      </section>
    )
  }
}

const SearchForm = Form.create({
  name: 'search_form'
})(Search)

class Home extends Component {
  render() {
    return (
      <section className="home-container">
        <SearchForm></SearchForm>
      </section>
    )
  }
}

export default Home