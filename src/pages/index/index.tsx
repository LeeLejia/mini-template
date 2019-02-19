import Taro, { Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'
import baseComponent from '@utils/baseComponent'

const newComponent = baseComponent('index')

export default class extends newComponent {

  config: Config = {
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: '主页'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text>Hello world! hello hello!!</Text>
      </View>
    )
  }
}

