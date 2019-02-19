import {AppConfig, LeanCloudConfig } from '../fssCloud/interface'

interface PageConfig {
  path: string,
  bundle: {[key: string]: any}
}

interface ProjectConfig extends AppConfig{
  isDebug: boolean,
  leancloud: LeanCloudConfig,
  pages: {
    [key: string]: PageConfig
  }
}

const config: ProjectConfig = {
  isDebug: true,
  appName: 'xx',
  asMainAccount: true,
  loginByUnionId: true,
  leancloud: {
    appId: 'aaa',
    appKey: 'aaa'
  },
  relationMiniProgram: {},
  pages: {
    'index': {
      path: 'pages/index/index',
      bundle: {}
    }
  }
}

export default config