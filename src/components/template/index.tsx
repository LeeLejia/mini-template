import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import baseComponent from '@utils/baseComponent'
import './index.scss'

const newComponent = baseComponent<{}, {
  
}>()

export default class extends newComponent{
  
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