import Taro, { Component, Config } from '@tarojs/taro'
import fc from 'fsscloud'
import api from '@api'
import utils from '@utils/utils'
import myConfig from '@config/index'

function baseComponent<P = {}, S = {}>(key?: keyof typeof myConfig.pages, bundle?: Config) {
  return class extends Component<P, S> {
    $fc: typeof fc
    $api: typeof api
    $utils: typeof utils
    $config: typeof myConfig
    $bundle: Config
    constructor() {
      super(...arguments)
      this.$bundle = Object.assign({}, key && myConfig.pages[key].bundle, bundle)
      this.$fc = fc
      this.$utils = utils
      this.$api = api
      this.$config = myConfig
    }

    // 设置 bar 样式
    setBarStyle(bg: string, style: string, title?: string) {
      Taro.setNavigationBarColor({
        frontColor: style,
        backgroundColor: bg
      })
      title && Taro.setNavigationBarTitle({ title })
    }

    // 跳转到页面
    navigateTo(pageName: keyof typeof myConfig.pages) {
      const page = myConfig.pages[pageName]
      if(page) {
        Taro.navigateTo({url: page.path})
      } else {
        console.error(`不存在页面：${pageName}`)
      }
    }

    // 替换页面
    redirectTo(pageName: keyof typeof myConfig.pages) {
      const page = myConfig.pages[pageName]
      if(page) {
        Taro.redirectTo({url: page.path})
      } else {
        console.error(`不存在页面：${pageName}`)
      }
    }

    // 返回
    navigateBack(delta?: 'index' | 1 | 2 | 3 | 4 | 5) {
      const page = delta === 'index' ? 100 : delta
      Taro.navigateBack({
        delta: page || 1
      })
    }
  }
}

export default baseComponent