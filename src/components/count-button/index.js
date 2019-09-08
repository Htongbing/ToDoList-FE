import React, { Component } from "react"
import { Statistic, Button } from "antd";
import './index.scss'

class CountButton extends Component {
  state = {
    status: 'normal'
  }
  componentDidMount() {
    this.props.immediately && this.clickButton()
  }
  clickButton = async () => {
    this.setState({ status: 'loading' })
    const { clickBtn } = this.props
    try {
      await clickBtn()
    } catch (e) {}
    this.setState({ status: 'timing' })
  }
  render() {
    const { status } = this.state
    const { timing = 60 } = this.props 
    return (
      <section className="count-button-container">
        {status !== 'timing' ? <Button type="link" block loading={status === 'loading'} onClick={this.clickButton}>{status === 'loading' ? '' : '点击发送'}</Button> : <Statistic.Countdown format="s[s]" value={Date.now() + timing * 1000} className="timing" onFinish={() => { this.setState({ status: 'normal' }) }}></Statistic.Countdown>}
      </section>
    )
  }
}

export default CountButton