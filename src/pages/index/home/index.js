import React, { Component } from 'react'
import { Form, Input, Select, DatePicker, Button, Table } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
import './index.scss'
moment.locale('zh-cn')

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
const STATUS_MAP = {
  0: '未开始',
  1: '进行中',
  2: '已完成'
}

class Search extends Component {
  search = () => {
    const { search, form: { getFieldsValue } } = this.props
    const values = getFieldsValue(), createdTime = values.createdTime
    if (createdTime && createdTime.length) {
      const [from, to] = createdTime
      Object.assign(values, {
        'createdTimeFrom': + new Date(from.format('YYYY-MM-DD [00:00:00]')),
        'createdTimeTo': + new Date(to.format('YYYY-MM-DD [00:00:00]')) + 8.64e7 - 1000
      })
    }
    delete values.createdTime
    search(values)
  }
  reset = () => {
    this.props.form.resetFields()
    this.search()
  }
  render() {
    const { getFieldDecorator } = this.props.form
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
            {getFieldDecorator('createdTime')(<DatePicker.RangePicker allowClear format="YYYY-MM-DD"></DatePicker.RangePicker>)}
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={this.search}>查询</Button>
            <Button onClick={this.reset}>重置</Button>
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
  state = {
    columns: [
      {
        title: '任务名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'createdTime',
        key: 'createdTime',
        render: time => moment(time).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '任务状态',
        dataIndex: 'status',
        key: 'status',
        render: status => (
          <div className={`status status-${status}`}>{STATUS_MAP[status]}</div>
        )
      }
    ],
    data: [
      {
        key: 0,
        name: '没钱',
        createdTime: Date.now(),
        status: 1
      }
    ]
  }
  search = data => {
    console.log(data)
  }
  render() {
    const { columns, data } = this.state
    return (
      <section className="home-container">
        <SearchForm search={this.search}></SearchForm>
        <section className="table-container">
          <Table columns={columns} dataSource={data}></Table>
        </section>
      </section>
    )
  }
}

export default Home