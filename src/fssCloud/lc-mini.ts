import Taro from '@tarojs/taro'
import leanCloud from './leancloud-storage-min'
import { AppConfig } from './interface'

let config: AppConfig
const state: {
  userPromise?: (() => Promise<leanCloud.User>),
  authUserInfoPromise?: Promise<void>
  authUserInfoResolve?: (() => void)
} = {}

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
      const curUser = option.loginByUnionId ? loginWithWxUnionId() : leanCloud.User.loginWithWeapp()
      updateUserInfo(curUser)
      return curUser
    })
  }
  // 执行登陆
  getCurrentUser()
}

// 更新用户信息
async function updateUserInfo(user?: Promise<leanCloud.User>) {
  const taroUser = await Taro.getUserInfo()
  // 获取用户信息
  const info = taroUser.userInfo
  const lcUser = user?(await user):leanCloud.User.current()
  const lcInfo = lcUser.attributes
  let same = true
  Object.keys(info).forEach(key => {
    if(lcInfo[key]!==info[key]) {
      same = false
      lcUser.set(key, info[key])
      console.log(`用户字段更新:${key}=${lcInfo[key]}[pre],${key}=${info[key]}[now]`)
    }
  })
  if(!same) {
    lcUser.save()
  }
}

// 使用微信unionId登陆
function loginWithWxUnionId(): Promise<leanCloud.User> {
  return Promise.all([Taro.login(), Taro.getUserInfo()]).then(res => {
    const paramsJson = {
      code: res[0].code,
      res: res[1],
    }
    return leanCloud.Cloud.run('wxLogin', paramsJson).then(function (data) {
      if (!data.unionid) {
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
  return leanCloud.Cloud.run('wxGetPhone', { session_key, encryptedData, iv })
}

// 获取当前用户,执行登陆 leancloud自带了缓存，所以leanCloud.User.current()几乎每次都能返回值
async function getCurrentUser(): Promise<leanCloud.User> {
  return leanCloud.User.current() || state.userPromise && state.userPromise().then(() => {
    return leanCloud.User.current()
  })
}

const exportObj = {
  init,
  getCurrentUser,
  getPhoneNumber,
  updateUserInfo
}

export default exportObj