import Taro from '@tarojs/taro'
// import leanCloud from './lc-cloud'
// import lcmin from './lc-mini'
import cache from './cache'
import { InitOption } from './interface'
import { State } from './state'
// import abTest from './abTest'
import wxCloud from './wx-cloud'
const state: State = new State()

const miniApp = wxCloud // lcmin

function init(option: InitOption) {
  // leanCloud.init(option)
  miniApp.init(option)
  // option.testAb && abTest.init(option.testAb.appKey, option.testAb.clientId, option.testAb.option)
  state.setDebugger(option.isDebugger)
}

// 检查用户登陆状态
function checkLoginStatus(loginPath?: string, force?: boolean): boolean {
  const hasLogin = state.get('Person', 'hasLogin', false)
  if (!hasLogin && loginPath) {
    const url = `${loginPath}?force=${force?true:false}`
    Taro.navigateTo({ url })
  }
  return !!hasLogin
}

// 设置用户状态
type SetUserStateResult = { hasLogin: boolean, userInfo?: any }
async function setUserState(): Promise<SetUserStateResult> {
  return miniApp.getCurrentUser().then(res => {
    if(!res) 
      return { hasLogin: false, userInfo: {} }
    const user = res['iv']? res['userInfo'] : res['attributes']
    state.set('Person', 'hasLogin', true)
    state.set('Person', 'userInfo', user)
    return { hasLogin: true, userInfo: user }
  }).catch(err => {
    state.set('Person', 'hasLogin', false)
    console.log('error::', err)
    return { hasLogin: false }
  })
}

export default {
  // ...leanCloud,
  ...cache,
  ...miniApp,
  // abTest,
  state,
  init,
  checkLoginStatus,
  setUserState
}