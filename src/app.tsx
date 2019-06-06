import Taro, { Component, Config } from '@tarojs/taro'
import Index from './pages/index'
import fc from 'fsscloud'
import api from '@api'
import appConfig from '@config/index'
import '@utils/prototype-mixin'
import '@utils/ts-declare'
import './interface'
import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }
class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/webview/index',
      'pages/login-page/index',
      'pages/person-page/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: APP_NAME,
      navigationBarTextStyle: 'black'
    }
  }

  componentWillMount() {
    fc.init({...appConfig.leancloud, ...appConfig})
    api.checkForUpdate()
    fc.setUserState()
    // 加载在线配置
    appConfig.appConfig = fc.readConfig()
    setTimeout(() => {
      fc.checkLoginStatus(appConfig.pages.login.path)
    }, 1000)
  }
  
  componentDidShow() {

  }

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
