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

const config: ProjectConfig = {
  isDebugger: IS_DEBUG,
  appName: APP_NAME,
  asMainAccount: true,
  loginByUnionId: false,
  leancloud: {
    appId: 'Oc72IpiQ9BPnocwOCQSjj10Y-gzGzoHsz',
    appKey: 'lTzR0fHpeb5sRtpKgKpcXYbG'
  },
  testAb: {
    appKey: 'TESTIN_wadc901fa-c75f-457a-ad20-b8e0f2ac8883'
  },
  relationMiniProgram: {},
  pages: {
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
}

export default config