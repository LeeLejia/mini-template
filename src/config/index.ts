import {AppConfig, LeanCloudConfig, TestinABConfig  } from '../fssCloud/interface'

interface PageConfig {
  path: string,
  bundle: {
    onShare: boolean,
    [key: string]: any
  }
}

interface ProjectConfig extends AppConfig{
  leancloud: LeanCloudConfig,
  testAb?: TestinABConfig,
  wxCloud?: Taro.cloud.ICloudConfig,
  pages: {
    [key: string]: PageConfig
  }
}

// 页面配置
const pageConfig = {
  index: {
    path: '/pages/index/index',
    bundle: {
      onShare: true
    }
  },
  webview: {
    path: '/pages/webview/index',
    bundle: {}
  },
  person: {
    path: '/pages/person-page/index',
    bundle: {}
  },
  login: {
    path: '/pages/login-page/index',
    bundle: {}
  }
}

const config: ProjectConfig = {
  isDebugger: IS_DEBUG,
  appName: APP_NAME,
  asMainAccount: true,
  loginByUnionId: false,
  leancloud: {
    appId: '',
    appKey: '',
    production: false
  },
  testAb: {
    appKey: ''
  },
  wxCloud: {
    traceUser: true,
    env: 'youhuo-hx9ul'
  },
  relationMiniProgram: {},
  pages: pageConfig
}

export type PagesKey = keyof typeof pageConfig

export default config