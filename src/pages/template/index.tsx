import Taro, { Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import baseComponent from '@utils/baseComponent'
import './index.scss'

const newComponent = baseComponent<{}, {
  
}>()

export default class extends newComponent{
  
  config: Config = {
    navigationBarBackgroundColor: '#00c7d2',
    navigationBarTextStyle: 'white',
    navigationBarTitleText: '粉刷刷'
  }

  componentWillMount() {
  }


  render () {
    const {  } = this.state
    return (
      <View className='xxx-container'>
       
      </View>
    )
  }
}