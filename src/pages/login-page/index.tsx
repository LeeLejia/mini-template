import Taro, {Config} from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import baseComponent from '@utils/baseComponent'
import './index.scss'

const newComponent = baseComponent<{}, {
  loadding: boolean
}>()

let force:boolean = true

export default class extends newComponent{
  
  state = {
    loadding: false
  }

  config: Config = {
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: '粉刷刷'
  }

  componentWillPreload(option){
    force = (option.force === 'true')
  }

  componentWillUnmount () { 
    if (force) {
      this.$api.checkLoginStatus(true)
    }
  }

  onGetUserInfo({detail}) {
    if (this.state.loadding) {
      return
    }
    if(detail.errMsg === 'getUserInfo:ok'){
      this.setState({loadding: true})
      this.$api.setUserInfo(true).then(res => {
        this.setState({loadding: false})
        if (res.hasLogin) {
          Taro.showToast({
            title: '登陆成功',
            icon: 'none',
            duration: 1500
          })
          setTimeout(() => {
            force = false
            Taro.navigateBack({delta: 1})
          }, 1500)
        } else {
          Taro.showToast({
            title: '登陆失败，请重试',
            icon: 'none'
          })
        }
      })
    } else {
      Taro.showToast({
        title: '授权失败',
        icon: 'none'
      })
      // 跳回首页
      setTimeout(() => {
        force = false
        Taro.navigateBack({delta: 100})
      }, 2000)
    }
  }

  render () {
    const { loadding } = this.state
    return (
      <View className='login-container'>
        <View className='notice-text'>登陆后才可以进行操作哦</View>
        <Button 
          className='login-bt' 
          loading={loadding} 
          openType='getUserInfo' 
          onGetUserInfo={this.onGetUserInfo.bind(this)}>使用微信登录</Button>
      </View>
    )
  }
}