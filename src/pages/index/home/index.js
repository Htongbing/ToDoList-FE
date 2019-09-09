import React, { Component } from 'react'
import { Form, Input, Select, DatePicker, Button, Table, Modal } from 'antd'
import { getTaskList } from '../../../api'
import { TASK_NAME_RE, TASK_CONTENT_RE } from '../../../const'
import moment from 'moment'
import 'moment/locale/zh-cn'
import './index.scss'
moment.locale('zh-cn')

const { Option } = Select
const STATUS = {
  0: '未完成',
  1: '已完成',
  2: '已延期'
}
const statusOptions = Object.keys(STATUS).map(i => ({ label: STATUS[i], value: i }))
const DIALOG_TYPE = {
  add: '添加',
  edit: '修改',
  view: '查看'
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
                statusOptions.map(({label, value}) => (
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

class Dialog extends Component {
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <section className="dialog-form-container">
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          <Form.Item label="任务名称">
            {getFieldDecorator('name', {
              rules: [
                { required: true, message: '请输入任务名称' },
                { pattern: TASK_NAME_RE, message: '任务名称不能包含特殊符号，且不能超过20个字符' }
              ]
            })(<Input placeholder="请输入任务名称"/>)}
          </Form.Item>
          <Form.Item label="任务内容">
            {getFieldDecorator('content', {
              rules: [
                { required: true, message: '请输入任务内容' },
                { pattern: TASK_CONTENT_RE, message: '任务内容不能包含特殊符号，且不能超过20个字符' }
              ]
            })(<Input.TextArea className="dialog-textarea" placeholder="请输入任务内容"/>)}
          </Form.Item>
          <Form.Item label="预计完成时间">
            {getFieldDecorator('estimatedTime')(<DatePicker allowClear className="dialog-picker" format="YYYY-MM-DD HH:mm:ss" showTime></DatePicker>)}
          </Form.Item>
          <Form.Item label="备注">
            {getFieldDecorator('remark')(<Input placeholder="请输入备注"/>)}
          </Form.Item>
        </Form>
      </section>
    )
  }
}

const DialogForm = Form.create({
  name: 'dialog_form'
})(Dialog)

class Home extends Component {
  state = {
    searchParams: {},
    loading: false,
    columns: [
      {
        title: '任务名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '任务内容',
        dataIndex: 'content',
        key: 'content'
      },
      {
        title: '创建时间',
        dataIndex: 'createdTime',
        key: 'createdTime',
        render: time => moment(time).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '预计完成时间',
        dataIndex: 'estimatedTime',
        key: 'estimatedTime',
        render: time => moment(time).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '任务状态',
        dataIndex: 'status',
        key: 'status',
        render: status => (
          <div className={`status status-${status}`}>{STATUS[status]}</div>
        )
      },
      {
        title: '操作',
        key: 'operate',
        render: () => (
          <Button type="link">修改</Button>
        )
      }
    ],
    data: [],
    rowSelection: {},
    dialog: {}
  }
  componentDidMount() {
    this.getList()
  }
  getList = async () => {
    this.setState({ loading: true })
    try {
      const { data } = await getTaskList(this.state.searchParams)
      data.forEach((item, index) => {
        item.key = index
      })
      this.setState({ data })
    } catch (e) {}
    this.setState({ loading: false })
  }
  search = data => {
    this.setState({ searchParams: data }, () => {
      this.getList()
    })
  }
  openDialog = type => {
    this.setState({ dialog: { type, visible: true } })
  }
  closeDialog = () => {
    const { dialog } = this.state
    if (dialog.confirmLoading) return
    this.setState({
      dialog: {
        ...dialog,
        visible: false
      }
    })
    this.refs.dialogForm.resetFields()
  }
  validateFields = () => {
    return new Promise((resolve, reject) => {
      this.refs.dialogForm.validateFields((err, values) => !err ? resolve(values) : reject(err))
    })
  }
  confirm = async () => {
    try {
      const values = await this.validateFields()
      console.log(values)
    } catch (e) {
      const { dialog } = this.state
      dialog.confirmLoading && this.setState({
        dialog: {
          ...dialog,
          confirmLoading: false
        }
      })
    }
  }
  render() {
    const { columns, data, rowSelection, loading, dialog: {type, visible, confirmLoading} } = this.state
    return (
      <section className="home-container">
        <SearchForm search={this.search}></SearchForm>
        <section className="header-button-container">
          <Button type="primary" onClick={() => { this.openDialog('add') }}>添加</Button>
          <Button type="danger">删除</Button>
        </section>
        <section className="table-container">
          <Table loading={loading} rowSelection={rowSelection} columns={columns} dataSource={data}></Table>
        </section>
        <Modal title={DIALOG_TYPE[type]} visible={visible} confirmLoading={confirmLoading} onCancel={this.closeDialog} width={640} maskClosable={false} onOk={this.confirm}>
          <DialogForm ref="dialogForm"></DialogForm>
        </Modal>
      </section>
    )
  }
}

export default Home