import {AppConfig, LeanCloudConfig } from '../fssCloud/interface'

interface PageConfig {
  path: string,
  bundle: {[key: string]: any}
}

interface ProjectConfig extends AppConfig{
  leancloud: LeanCloudConfig,
  pages: {
    [key: string]: PageConfig
  }
}

const config: ProjectConfig = {
  isDebugger: true,
  appName: '粉刷刷',
  asMainAccount: true,
  loginByUnionId: false,
  leancloud: {
    appId: 'fxJkXC9XzNWwcIvIu8w3YNKi-gzGzoHsz',
    appKey: 'Ch0mWxhRlCE6zPhn5DSNGwVJ'
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