import React, { Component } from "react"
import { Statistic, Button } from "antd";
import './index.scss'

class CountButton extends Component {
  state = {
    status: 'normal',
    timing: 0
  }
  componentDidMount() {
    this.props.immediately && this.clickButton()
  }
  clickButton = async () => {
    this.setState({ status: 'loading' })
    const { clickBtn, timing = 60 } = this.props
    try {
      await clickBtn()
    } catch (e) {}
    this.setState({ status: 'timing', timing: Date.now() + timing * 1000 })
  }
  render() {
    const { status, timing } = this.state
    return (
      <section className="count-button-container">
        {status !== 'timing' ? <Button type="link" block loading={status === 'loading'} onClick={this.clickButton}>{status === 'loading' ? '' : '点击发送'}</Button> : <Statistic.Countdown format="s[s]" value={timing} className="timing" onFinish={() => { this.setState({ status: 'normal' }) }}></Statistic.Countdown>}
      </section>
    )
  }
}

export default CountButton