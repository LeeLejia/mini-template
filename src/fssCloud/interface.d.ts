import leanCloud from './leancloud-storage-min'

/* app配置 */
interface AppConfig {
  appName: string,
  isDebugger: boolean,
  asMainAccount: boolean,
  loginByUnionId: boolean,
  relationMiniProgram: {
    [key: string]: {
      appId: string,
      path: string,
      envVersion: 'develop' | 'trial' | 'release'
    }
  }
}

/* leanCloud配置 */
interface LeanCloudConfig {
  appId: string;
  appKey: string;
  masterKey?: string;
  region?: string;
  production?: boolean;
  serverURLs?: string | leanCloud.ServerURLs;
  disableCurrentUser?: boolean;
}

/* 初始化参数 */
interface InitOption extends AppConfig, LeanCloudConfig {}

/* 权限控制参数 */
type AccessType = 'none' | 'self' | 'public' | Array<string> | leanCloud.User | Array<leanCloud.User> | leanCloud.Role | Array<leanCloud.Role>
interface AccessControl {
  read?: AccessType,
  write?: AccessType
}

export {
  AppConfig,
  LeanCloudConfig,
  InitOption,
  AccessControl
}