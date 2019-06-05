import Taro, { Config } from '@tarojs/taro'
import { View, WebView } from '@tarojs/components'
import baseComponent from '@utils/baseComponent'
import './index.scss'

const newComponent = baseComponent<{}, {
  url: string, 
  title: string
}>('webview')

export default class extends newComponent{
  
  config: Config = {
    navigationBarBackgroundColor: '#00c7d2',
    navigationBarTextStyle: 'white',
    navigationBarTitleText: APP_NAME,
    disableScroll: true
  }

  componentLoadOption(data: any) {
    if(!data || !data.url) {
      this.navigateBack()
      return
    }
    this.setState({
      url: data.url
    })
    Taro.setNavigationBarTitle({ title: data.title || APP_NAME })
  }


  render () {
    const { url } = this.state
    return (
      <View className='webview'>
        <WebView src={url} />
      </View>
    )
  }
}