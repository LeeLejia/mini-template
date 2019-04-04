import Taro, { Component, Config } from '@tarojs/taro'
import fc from 'fsscloud'
import api from '@api'
import utils from '@utils/utils'
import myConfig, { PagesKey } from '@config/index'

function baseComponent<P = {}, S = {}>(key: PagesKey, bundle?: Config) {
  abstract class newComponent extends Component<P, S> {
    $fc: typeof fc
    $api: typeof api
    $utils: typeof utils
    $config: typeof myConfig
    $bundle: Config
    private _componentWillMount
    constructor() {
      super(...arguments)
      this.$bundle = Object.assign({}, key && myConfig.pages[key].bundle, bundle)
      this.$fc = fc
      this.$utils = utils
      this.$api = api
      this.$config = myConfig
      this._componentWillMount = this.componentWillMount
      this.componentWillMount = this.componentWillMountHook
    }
  
    abstract componentLoadOption(data: any): void
  
    // 设置 bar 样式
    setBarStyle(bg: string, style: string, title?: string) {
      Taro.setNavigationBarColor({
        frontColor: style,
        backgroundColor: bg
      })
      title && Taro.setNavigationBarTitle({ title })
    }
  
    componentWillMountHook() {
      // todo 解析query
      const data = this.$fc._getPageCache(key)
      if(data && this.componentLoadOption) {
        this.componentLoadOption(data)
      }
      if(this._componentWillMount) {
        this._componentWillMount()
      }
      return
    }
  
    // 跳转到页面
    navigateTo(pageName: PagesKey, option?: {[key: string]: any}) {
      const page = myConfig.pages[pageName]
      if(page) {
        if(option) {
          this.$fc._setPageCache(pageName, option)
        }
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
  return newComponent
}

export default baseComponent