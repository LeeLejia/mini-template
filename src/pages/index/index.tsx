import Taro, { Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import baseComponent from '@utils/baseComponent'
import CircleButton from '@components/circle-button'
import headerPic from '@img/illustrator.png'
import iconMe from '@img/icon_me.png'
import iconPlan from '@img/icon_plan.png'
import './index.scss'

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

  componentDidShow() {
  }

  onPay() {
    var paramsJson = {
      productDescription: 'test mini',
      amount: 1,
    }
    this.$fc.Cloud.run('wxOrder', paramsJson).then(data=>{
      console.log('预请求订单成功')
      Taro.requestPayment(data).then(res=>{
        console.log('支付完成')
        console.log('pay result:', res)
      })
    })
  }

  render() {
    const { } = this.state
    return (
      <View className='index-container'>
        <View className='bt' onClick={this.onPay.bind(this)}>支付</View>
      </View>
    )
  }
}

