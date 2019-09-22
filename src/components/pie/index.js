import React, { Component } from 'react'
import { DatePicker, Icon } from 'antd'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import moment from 'moment'
import 'moment/locale/zh-cn'
import './index.scss'
moment.locale('zh-cn')

class Pie extends Component {
  state = {
    showLoading: false,
    params: {
      startTime: + new Date(moment(new Date()).format('YYYY-MM-DD [00:00:00]')),
      endTime: + new Date(moment(new Date()).format('YYYY-MM-DD [00:00:00]')) + 8.64e7 - 1000
    }
  }
  componentDidMount() {
    const { getData } = this.props
    getData && this.getData()
  }
  getData = async () => {
    const { getData } = this.props
    try {
      this.setState({ showLoading: true })
      await getData(this.state.params)
    } catch (e) {}
    this.setState({ showLoading: false })
  }
  getOption = () => {
    const { name, data, legend } = this.props
    return {
      title: {
        text: name,
        textStyle: {
          fontSize: '14',
          lineHeight: 32
        }
      },
      legend: {
        orient: 'vertical',
        x: 'right',
        data: legend
      },
      tooltip: {
        formatter: '{b}：{c}({d}%)'
      },
      series: [{
        name,
        type: 'pie',
        radius: ['50%', '70%'],
        label: {
          normal: {
            show: false,
            position: 'center',
            formatter: '{b}\n{d}%',
            textStyle: {
              lineHeight: 22,
              fontSize: 16
            }
          },
          emphasis: {
            show: true
          }
        },
        data
      }]
    }
  }
  changeDate = date => {
    const [ startTime, endTime ] = date
    this.setState({
      params: {
        startTime: startTime ? + new Date(startTime.format('YYYY-MM-DD [00:00:00]')) : undefined,
        endTime: endTime ? + new Date(endTime.format('YYYY-MM-DD [00:00:00]')) + 8.64e7 - 1000 : undefined
      }
    }, this.getData)
  }
  render() {
    const { style, showDate } = this.props
    const { showLoading, params: {startTime, endTime} } = this.state
    const defaultDate = [moment(startTime), moment(endTime)]
    return (
      <section className="pie-container">
        {showDate ? <section className="search-time-container">
          <DatePicker.RangePicker defaultValue={defaultDate} size="small" allowClear format="YYYY-MM-DD" onChange={this.changeDate}></DatePicker.RangePicker>
        </section> : null}
        <section className={`chart-container${showDate ? '' : ' no-search'}`}>
          <ReactEchartsCore echarts={echarts} option={this.getOption()} style={style} showLoading={showLoading}></ReactEchartsCore>
        </section>
        <section className="refresh" onClick={() => { !showLoading && this.getData() }}>
          <Icon type="sync" spin={showLoading} />
        </section>
      </section>
    )
  }
}

export default Pie