import {AppConfig, LeanCloudConfig, TestinABConfig  } from '../fssCloud/interface'

interface PageConfig {
  path: string,
  bundle: {[key: string]: any}
}

interface ProjectConfig extends AppConfig{
  leancloud: LeanCloudConfig,
  testAb?: TestinABConfig
  pages: {
    [key: string]: PageConfig
  }
}

// 页面配置
const pageConfig = {
  index: {
    path: '/pages/index/index',
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
    appId: 'Oc72IpiQ9BPnocwOCQSjj10Y-gzGzoHsz',
    appKey: 'lTzR0fHpeb5sRtpKgKpcXYbG',
    production: false
  },
  testAb: {
    appKey: 'TESTIN_wadc901fa-c75f-457a-ad20-b8e0f2ac8883'
  },
  relationMiniProgram: {},
  pages: pageConfig
}

export type PagesKey = keyof typeof pageConfig

export default config