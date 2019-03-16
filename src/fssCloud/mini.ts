import Taro from '@tarojs/taro'
import leanCloud from './leancloud-storage-min'
import { AppConfig } from './interface'

const STORAGE_USER_INFO = 'storage_user_info'
const STORAGE_USER_INFO_TIMESTAMP = 'storage_user_info_timestamp'

let config: AppConfig
const state: {
  userPromise: (() => Promise<leanCloud.User>) | undefined,
  authUserInfoPromise: Promise<void> | undefined,
  authUserInfoResolve: (() => void) | undefined
} = {
  userPromise: undefined,
  authUserInfoPromise: undefined,
  authUserInfoResolve: undefined
}

// 初始化云
function init(option: AppConfig): void {
  config = option
  // 用户授权状态
  state.authUserInfoPromise = new Promise((resolve) => {
    state.authUserInfoResolve = resolve
  })
  // 用户状态 - 检查授权情况，授权后才进行的状态，返回值为user的promise
  state.userPromise = () => {
    // 每次调用都检查权限
    const getSettingResult = Taro.getSetting().then(({ authSetting }) => {
      if (authSetting["scope.userInfo"] && state.authUserInfoResolve) {
        state.authUserInfoResolve()
      }
      return state.authUserInfoPromise
    })
    return Promise.race([state.authUserInfoPromise, getSettingResult]).then(() => {
      if (option.loginByUnionId) {
        return loginWithWxUnionId()
      } else {
        return leanCloud.User.loginWithWeapp()
      }
    })
  }
}
// 获取用户数据是 leancloud user
async function getUserInfo(option: {
  forceUpdate?: boolean,
  overdue?: number
}): Promise<leanCloud.User> {
  const params = Object.assign({ forceUpdate: false, overdue: (1000 * 3600 * 24 * 10) }, option)
  const lastTime = Taro.getStorageSync(STORAGE_USER_INFO_TIMESTAMP)
  // 不强制更新并且没过期则读缓存
  if (!params.forceUpdate && new Date().getTime() - lastTime < params.overdue) {
    const cache = await Taro.getStorage({ key: STORAGE_USER_INFO })
    console.log('读到用户数据缓存:', cache)
    if (cache) {
      return Promise.resolve(cache.data)
    }
  }
  // 获取用户信息
  return Taro.getUserInfo().then(res => {
    const info = res.userInfo
    if (state.userPromise) {
      return state.userPromise().then(user => {
        Object.keys(info).forEach(key => {
          user.set(key, info[key])
        })
        user.save().then(() => {
          // 上传成功才设置缓存
          Taro.setStorage({
            key: STORAGE_USER_INFO_TIMESTAMP,
            data: new Date().getTime()
          })
          Taro.setStorage({
            key: STORAGE_USER_INFO,
            data: user
          })
        }).catch(console.error)
        console.log('读取到用户数据:', info)
        return user
      })
    } else {
      throw Error('服务尚未初始化')
    }

  }).catch(res => {
    console.log('读取到用户数据失败:', res)
    throw res
  })
}

// 使用微信unionId登陆
function loginWithWxUnionId(): Promise<leanCloud.User> {
  return Promise.all([Taro.login(), Taro.getUserInfo()]).then(res => {
    const paramsJson = {
      code: res[0].code,
      res: res[1],
    }
    return leanCloud.Cloud.run('wxLogin', paramsJson).then(function (data) {
      if(!data.unionid) {
        throw Error('获取unionId失败，请将小程序和主体公众号绑定')
      }
      return leanCloud.User.loginWithAuthDataAndUnionId({
        uid: data.openid,
        access_token: data.token,
      }, config.appName, data.unionid, {
          unionIdPlatform: 'weixin',
          asMainAccount: config.asMainAccount,
        }).then(() => {
          return leanCloud.User.current()
        })
    })
  })
}

// 获取用户手机号码
async function getPhoneNumber(encryptedData: string, iv: string): Promise<any> {
  const user = leanCloud.User.current()
  if (!user) throw Error('尚未登陆')
  const session_key = user.get('authData').lc_weapp.session_key
  return leanCloud.Cloud.run('wxGetPhone', {session_key, encryptedData, iv})
}

// 获取当前用户
async function getCurrentUser(): Promise<leanCloud.User> {
  return leanCloud.User.current() || state.userPromise && state.userPromise().then(() => {
    return leanCloud.User.current()
  })
}

const exportObj = {
  init,
  getUserInfo,
  getCurrentUser,
  getPhoneNumber
}

export default exportObj