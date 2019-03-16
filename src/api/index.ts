import fc from 'fsscloud'
import Taro from '@tarojs/taro'
import appConfig from '@config/index'

// 检查用户登陆状态
function checkLoginStatus(nav: boolean = true, force: boolean = true): boolean {
  const hasLogin = fc.state.get('person', 'hasLogin', false)
  if (!hasLogin && nav) {
    const url = `${appConfig.pages.login.path}?force=${force}`
    Taro.navigateTo({ url })
  }
  return hasLogin
}

// 设置用户信息
async function setUserInfo(forceUpdate?: boolean): Promise<{ hasLogin: boolean, userInfo?: any }> {
  return fc.getUserInfo({ forceUpdate }).then(res => {
    fc.state.set('person', 'hasLogin', true)
    if (res.className === '_User') {
      const user = { ...res.attributes }
      if (!user.realName) {
        res.set('realName', user.nickName).save()
      }
      user.realName = user.realName || user.nickName
      fc.state.set('person', 'userInfo', user)
      return { hasLogin: true, userInfo: user }
    }
    fc.state.set('person', 'userInfo', res)
    return { hasLogin: true, userInfo: res }
  }).catch(err => {
    fc.state.set('person', 'hasLogin', false)
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
function getUserInfo(): DataType.UserType {
  return fc.state.get('person', 'userInfo', {})
}


export default {
  setUserInfo,
  checkLoginStatus,
  getUserInfo,
  isSpecialModel
}