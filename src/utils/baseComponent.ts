import { Component, Config } from '@tarojs/taro'
import fc from '@fssCloud'
import api from '@api'
import utils from '@utils/utils'
import myConfig from '@config/index'

function baseComponent(key: string, bundle?: Config) {
  return class extends Component {
    $fc: any
    $api: any
    $utils: any
    $bundle: {[key: string]: any}
    constructor() {
      super()
      this.$bundle = Object.assign({}, myConfig.pages[key] && myConfig.pages[key].bundle, bundle)
      this.$fc = fc
      this.$utils = utils
      this.$api = api
    }
  }
}
export default baseComponent