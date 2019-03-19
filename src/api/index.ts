import fc from 'fsscloud'
import Taro from '@tarojs/taro'
import appConfig from '@config/index'
import request from './request'

// 检查用户登陆状态
function checkLoginStatus(nav: boolean = true, force: boolean = true): boolean {
  const hasLogin = fc.state.get('Person', 'hasLogin', false)
  if (!hasLogin && nav) {
    const url = `${appConfig.pages.login.path}?force=${force}`
    Taro.navigateTo({ url })
  }
  return !!hasLogin
}

// 设置用户状态
type SetUserStateResult = { hasLogin: boolean, userInfo?: any }
async function setUserState(): Promise<SetUserStateResult> {
  return fc.getCurrentUser().then(res => {
    fc.state.set('Person', 'hasLogin', true)
    fc.state.set('Person', 'userInfo', res.attributes)
    return { hasLogin: true, userInfo: res.attributes }
  }).catch(err => {
    fc.state.set('Person', 'hasLogin', false)
    console.log('error::', err)
    return { hasLogin: false }
  })
}

// 获取机型
const sysInfo = Taro.getSystemInfo()
const specialList = ['iPhone X']
const isSpecial = sysInfo.then(res => {
  const isSpecial = specialList.some(item => res.model.indexOf(item) > -1)
  return isSpecial
})

// 是否特殊机型
function isSpecialModel(): Promise<boolean> {
  return isSpecial
}

// 获取用户信息
function getUserInfo(): DataType.UserInfo | undefined {
  return fc.state.get('Person', 'userInfo')
}

// 检查更新
function checkForUpdate() {
  const updateManager = Taro.getUpdateManager()
  updateManager.onCheckForUpdate((res) => {
    console.log('hasUpdate:', res.hasUpdate)
  })
  updateManager.onUpdateReady(function () {
    Taro.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？'
    }).then((res) => {
      if (res.confirm) {
        updateManager.applyUpdate()
      }
    })
  })
  updateManager.onUpdateFailed(function () {
    // 新的版本下载失败
  })
}


export default {
  setUserState,
  checkLoginStatus,
  getUserInfo,
  isSpecialModel,
  checkForUpdate,
  ...request
}