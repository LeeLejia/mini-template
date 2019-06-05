import Taro, { Component, Config } from '@tarojs/taro'
import fc from 'fsscloud'
import api from '@api'
import utils from '@utils/utils'
import myConfig, { PagesKey } from '@config/index'

function baseComponent<P = {}, S = {}>(key?: PagesKey, bundle?: { onShare: boolean, [key: string]: any }) {
  class newComponent extends Component<P, S> {
    $fc: typeof fc
    $api: typeof api
    $utils: typeof utils
    $config: typeof myConfig
    $bundle: {
      onShare: boolean,
      [key: string]: any
    }
    private _componentWillMount

    constructor() {
      super(...arguments)
      this.$bundle = Object.assign({}, key && myConfig.pages[key].bundle, bundle)
      this.$fc = fc
      this.$utils = utils
      this.$api = api
      this.$config = myConfig
      if (key) {
        if (bundle && bundle.onShare) {
          // onShareAppMessage() {
          //   return {
          //     title: '',
          //     path: '',
          //     imageUrl: ''
          //   }
          // }
          Taro.showShareMenu({
            withShareTicket: true
          })
        }
        this._componentWillMount = this.componentWillMount
        this.componentWillMount = this.componentWillMountHook
      }
    }

    componentLoadOption(data: any) { }

    componentWillMountHook() {
      if (!key)
        return
      const data = Object.assign({}, this.$router.params, this.$fc._getPageCache(key))
      if (data) {
        this.componentLoadOption(data)
      }
      if (this._componentWillMount) {
        this._componentWillMount()
      }
    }

    // 跳转到页面
    navigateTo(pageName: PagesKey, option?: { [key: string]: any }) {
      const page = myConfig.pages[pageName]
      if (page) {
        if (option) {
          this.$fc._setPageCache(pageName, option)
        }
        Taro.navigateTo({ url: page.path })
      } else {
        console.error(`不存在页面：${pageName}`)
      }
    }

    // 替换页面
    redirectTo(pageName: keyof typeof myConfig.pages) {
      const page = myConfig.pages[pageName]
      if (page) {
        Taro.redirectTo({ url: page.path })
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

    // 显示 toast
    showToast(title: string, icon?: string) {
      Taro.showToast({
        title,
        icon: icon ? icon : 'none'
      })
    }
  }
  return newComponent
}

export default baseComponent