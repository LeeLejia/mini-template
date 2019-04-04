import Taro, {Config} from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import baseComponent from '@utils/baseComponent'
import './index.scss'
import { PagesKey } from '@config/index';

const newComponent = baseComponent<{}, {
  person: {
    avatarUrl: string,
    nickName: string
  }
}>("person")

export default class extends newComponent{

  config: Config = {
    navigationBarTitleText: '个人中心',
    navigationBarTextStyle: 'black',
    navigationBarBackgroundColor: '#F8F8F8',
    disableScroll: true
  }

  componentWillMount() {
    // initData
    const user = this.$api.getUserInfo()
    if(!user) {
      return
    }
    this.setState({
      person: {
        avatarUrl: user.avatarUrl,
        nickName: user.nickName,
      }
    })
  }

  onClick(key: PagesKey) {
    this.navigateTo(key)
  }

  logout() {
    Taro.clearStorage()
    Taro.navigateBack({delta: 100})
  }

  render () {
    const { person } = this.state    
    return (
      <View className='person-container'>
        <View className='person-info'>
          <Image className='avatar' src={person.avatarUrl}/>
          <View className='name'>{person.nickName}</View>
        </View>
        <View className='settings'>
        { 
          [
            {title: '我的方案', desc: '', key: 'mySolution'},
            {title: '我的需求', desc: '', key: 'myDemand'},
          ].map(item => <View className='item' key={item.key} onClick={this.onClick.bind(this, item.key)}>
            <Text className='title'>{item.title}</Text>
            <Text className='desc'>{item.desc || ''}</Text>
          </View>)}
        </View>
        <View className='logout' onClick={this.logout}>退出登录</View>
      </View>
    )
  }
}