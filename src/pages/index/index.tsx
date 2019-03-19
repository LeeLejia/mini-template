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
    navigationBarTitleText: APP_NAME
  }
  componentWillMount() {  
  }

  componentDidShow() {
  }

  onPay() {
    console.log(123)
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

