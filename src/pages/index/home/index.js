import React, { Component } from 'react'
import { Form, Input, Select, DatePicker, Button, Table, Modal, message } from 'antd'
import Pie from '../../../components/pie'
import { getTaskList, createTask, finishTask, updateTask, deleteTasks, getStatistics } from '../../../api'
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
const { confirm } = Modal;

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
    const { type, data, form: { getFieldDecorator } } = this.props
    return (
      <section className="dialog-form-container">
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          <Form.Item label="任务名称">
            {getFieldDecorator('name', {
              rules: [
                { required: true, message: '请输入任务名称' },
                { pattern: TASK_NAME_RE, message: '任务名称不能包含特殊符号，且不能超过20个字符' }
              ],
              initialValue: data && data.name
            })(<Input disabled={type === 'view'} placeholder="请输入任务名称"/>)}
          </Form.Item>
          <Form.Item label="任务内容">
            {getFieldDecorator('content', {
              rules: [
                { required: true, message: '请输入任务内容' },
                { pattern: TASK_CONTENT_RE, message: '任务内容不能超过200个字符' }
              ],
              initialValue: data && data.content
            })(<Input.TextArea disabled={type === 'edit' || type === 'view'} className="dialog-textarea" placeholder="请输入任务内容"/>)}
          </Form.Item>
          <Form.Item label="预计完成时间">
            {getFieldDecorator('estimatedTime', {
              initialValue: data && data.estimatedTime && moment(data.estimatedTime)
            })(<DatePicker disabled={type === 'edit' || type === 'view'} allowClear className="dialog-picker" format="YYYY-MM-DD HH:mm:ss" showTime></DatePicker>)}
          </Form.Item>
          <Form.Item label="备注">
            {getFieldDecorator('remark', {
              initialValue: data && data.remark
            })(<Input disabled={type === 'view'} placeholder="请输入备注"/>)}
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
    pieLegend: Object.values(STATUS),
    curStatistics: [],
    allStatistics: [],
    searchParams: {},
    loading: false,
    columns: [
      {
        title: '任务名称',
        dataIndex: 'name',
        key: 'name',
        className: 'table-width'
      },
      {
        title: '任务内容',
        dataIndex: 'content',
        key: 'content',
        className: 'table-width'
      },
      {
        title: '创建时间',
        dataIndex: 'createdTime',
        key: 'createdTime',
        render: time => moment(time).format('YYYY-MM-DD HH:mm:ss'),
        className: 'table-width'
      },
      {
        title: '预计完成时间',
        dataIndex: 'estimatedTime',
        key: 'estimatedTime',
        render: time => time && moment(time).format('YYYY-MM-DD HH:mm:ss'),
        className: 'table-width'
      },
      {
        title: '任务状态',
        dataIndex: 'status',
        key: 'status',
        render: status => (
          <div className={`status status-${status}`}>{STATUS[status]}</div>
        ),
        className: 'table-width'
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        className: 'table-width'
      },
      {
        title: '操作',
        key: 'operate',
        render: (text, row) => {
          const { status, id } = row
          return (
            <div className="operate-container">
              <Button type="link" onClick={() => { this.openDialog('view', row) }}>查看</Button>
              <Button type="link" onClick={() => { this.openDialog('edit', row) }}>修改</Button>
              {status !== 1 ? <Button type="link" onClick={() => { this.finishTask(id) }}>完成</Button> : ''}
            </div>
          )
        },
        width: 180
      }
    ],
    data: [],
    pageAttrs: {
      page: 1,
      count: 10,
      pageSize: 10
    },
    rowSelection: {
      onChange: selectedRowKeys => {
        this.setState({ selectedRowKeys })
      }
    },
    dialog: {},
    selectedRowKeys: []
  }
  componentDidMount() {
    this.getList()
  }
  getList = async () => {
    this.setState({ loading: true })
    try {
      const { searchParams, pageAttrs } = this.state
      const { data, ...rest } = await getTaskList({ ...searchParams, ...pageAttrs })
      data.forEach(item => {
        item.key = item.id
      })
      this.setState({ data, pageAttrs: rest })
    } catch (e) {}
    this.setState({ loading: false })
  }
  search = data => {
    this.setState({ 
      searchParams: data,
      pageAttrs: {
        ...this.state.pageAttrs,
        page: 1
      } 
    }, () => {
      this.getList()
    })
  }
  openDialog = (type, row = null) => {
    this.setState({ dialog: { type, visible: true, row } })
  }
  closeDialog = () => {
    const { dialog } = this.state
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
      this.refs.dialogForm.validateFields((err, values) => {
        if (err) return reject(err)
        const { estimatedTime } = values
        estimatedTime && (values.estimatedTime = + new Date(estimatedTime))
        resolve(values)
      })
    })
  }
  confirm = async () => {
    const { dialog } = this.state
    try {
      const values = await this.validateFields()
      this.setState({
        dialog: {
          ...dialog,
          confirmLoading: true
        }
      })
      if (dialog.type === 'add') {
        await createTask(values)
      } else {
        await updateTask({
          id: dialog.row.id,
          data: values
        })
      }
      this.success()
      this.closeDialog()
    } catch (e) {}
    dialog.confirmLoading && this.setState({
      dialog: {
        ...dialog,
        confirmLoading: false
      }
    })
  }
  finishTask = id => {
    confirm({
      title: '提示',
      content: '确定要完成吗？',
      onOk: async () => {
        await finishTask(id)
        this.success()
      }
    })
  }
  deleteTasks = () => {
    confirm({
      title: '提示',
      content: '确定要删除吗？',
      onOk: async () => {
        await deleteTasks(this.state.selectedRowKeys.join(','))
        this.success()
      }
    })
  }
  success = () => {
    message.success('操作成功')
    this.getList()
  }
  getCurStatistics = async params => {
    const values = await getStatistics(params)
    this.setState({
      curStatistics: values.map(({ status, total }) => ({
        name: STATUS[status],
        value: total
      }))
    })
  }
  getAllStatistics = async () => {
    const values = await getStatistics()
    this.setState({
      allStatistics: values.map(({ status, total }) => ({
        name: STATUS[status],
        value: total
      }))
    })
  }
  render() {
    const { columns, data, rowSelection, loading, dialog: {type, visible, confirmLoading, row}, selectedRowKeys, pageAttrs, pieLegend, curStatistics, allStatistics } = this.state
    const { count, pageSize, page } = pageAttrs
    return (
      <section className="home-container">
        <section className="statistics-container">
          <div className="statistics-item-container">
            <Pie data={curStatistics} legend={pieLegend} name="任务当前完成情况" style={{height: '100%'}} getData={this.getCurStatistics} showDate></Pie>
          </div>
          <div className="statistics-item-container">
            <Pie data={allStatistics} legend={pieLegend} name="任务总体完成情况" style={{height: '100%'}} getData={this.getAllStatistics}></Pie>
          </div>
        </section>
        <SearchForm search={this.search}></SearchForm>
        <section className="header-button-container">
          <Button type="primary" onClick={() => { this.openDialog('add') }}>添加</Button>
          <Button type="danger" disabled={!selectedRowKeys.length} onClick={this.deleteTasks}>删除</Button>
        </section>
        <section className="table-container">
          <Table loading={loading} rowSelection={rowSelection} columns={columns} dataSource={data} pagination={{
            size: 'small',
            current: page,
            total: count,
            showSizeChanger: true,
            pageSize,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条数据`,
            onChange: page => {
              this.setState({
                pageAttrs: {
                  ...pageAttrs,
                  page
                }
              }, () => {
                this.getList()
              })
            },
            onShowSizeChange: (current, pageSize) => {
              this.setState({
                pageAttrs: {
                  count,
                  pageSize,
                  page: 1
                }
              }, () => {
                this.getList()
              })
            }
          }}></Table>
        </section>
        <Modal title={DIALOG_TYPE[type]} visible={visible} confirmLoading={confirmLoading} onCancel={this.closeDialog} width={640} maskClosable={false} onOk={this.confirm} {...type === 'view' ? { footer: null } : null}>
          <DialogForm ref="dialogForm" data={row} type={type}></DialogForm>
        </Modal>
      </section>
    )
  }
}

export default Home