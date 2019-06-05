import Taro, { Config } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import baseComponent from '@utils/baseComponent'
import './index.scss'
import { string } from '_@types_prop-types@15.7.1@@types/prop-types';

const newComponent = baseComponent<{}, {
}>('index')
export default class extends newComponent {

  config: Config = {
    navigationBarBackgroundColor: '#00c7d2',
    navigationBarTextStyle: 'white',
    navigationBarTitleText: APP_NAME,
    disableScroll: true
  }
  componentWillMount() {
  }

  componentLoadOption(data: any) {

  }

  componentDidShow() {
  }

  onPay() {
    this.$fc.onPay({
      id: '100001',
      count: 3
    }).then(res => {
      console.log('支付结果：', res)
    })
  }

  onPhone({detail}) {
    this.$fc.getPhoneNumber(detail).then(res=>{
      console.log('phone:', res)
    })
  }

  render() {
    const { } = this.state
    return (
      <View className='index-container'>
        <View className='bt' onClick={this.onPay.bind(this)}>支付</View>
        <Button openType='getPhoneNumber' onGetPhoneNumber={this.onPhone.bind(this)}>获取手机号码</Button>
      </View>
    )
  }
}

