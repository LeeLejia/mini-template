import Taro from '@tarojs/taro'
import { InitOption } from './interface';

const state: {
  userPromise?: (() => Promise<Taro.getUserInfo.Promised>),
  authUserInfoPromise?: Promise<void>
  authUserInfoResolve?: (() => void)
} = {}

function init(option: InitOption) {
  Taro.cloud.init(option.wxcloud)
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
      return loginWithWeapp()
    })
  }
}


function loginWithWeapp(): Promise<Taro.getUserInfo.Promised> {
  return Promise.all([Taro.login(), Taro.getUserInfo()]).then(res => {
    Taro.cloud.callFunction({
      name: 'login',
      data: { code: res[0].code }
    }).then(user => {
      console.log('login user:', user.result)
      const data = user.result && user.result['data']
      if (data.hasRegister === false) {
        updateUserInfo(res[1].userInfo)
      }
    }).catch(err => {
      console.log('login error:', err)
    })
    return res[1]
  })
}

// 更新用户信息
function updateUserInfo(userInfo: { [key: string]: any }) {
  Taro.cloud.callFunction({
    name: 'setUserInfo',
    data: { ...userInfo }
  }).then(res => {
    return res
  }).catch(console.error)
}

// 获取用户手机号码
async function getPhoneNumber(option: {encryptedData: string, iv: string}): Promise<{countryCode:string, phoneNumber: string, purePhoneNumber: string }> {
  return Taro.cloud.callFunction({
    name: 'decode',
    data: option
  }).then((res: any) => {
    const data = res.result['data']
    if(!res.result['status']) {
      throw new Error(res.result.msg)
    }
    return {
      countryCode: data.countryCode, 
      phoneNumber: data.phoneNumber, 
      purePhoneNumber: data.purePhoneNumber
    }
  })
}

// 获取用户信息
async function getCurrentUser(): Promise<Taro.getUserInfo.Promised | undefined> {
  return state.userPromise && state.userPromise().then(res => {
    return res
  })
}

async function onPay(goodsList: Array<{id: string, count: number}> | {id: string, count: number}): Promise<{status: boolean, msg: any}> {
  const params = Array.isArray(goodsList)?{goodsIds: goodsList}: {goodsId: goodsList}
  return Taro.cloud.callFunction({
    name: 'getPay',
    data: params
  }).then(({result})=>{
    if(result && result['status']) {
      const params = result['data']
      return Taro.requestPayment({
        'timeStamp': params.timeStamp,
        'nonceStr': params.nonceStr,
        'package': params.package,
        'signType': params.signType,
        'paySign': params.paySign
      }).then(res => {
        console.log('支付成功: ', res)
        return {
          status: true,
          msg: '支付成功！'
        }
      }).catch(err=>{
        console.log('支付失败: ',err)
        return {
          status: false,
          msg: err
        }
      })
    } else {
      return {
        status: false,
        msg: '支付失败'
      }
    }    
  })
}

// 发送信息
async function sendMsg(option: {
  templateId: string,
  formId: string,
  page?: string,
  data?: {[key:string]: any},
  emphasisKeyword?: string
}) {
  Taro.cloud.callFunction({
    name: 'sendMsg',
    data: option
  }).then(console.log)
}

// 读取全局配置信息
async function readConfig(): Promise<{[key: string]: any}> {
  
  return Taro.cloud.callFunction({
    name: 'readConfig',
    data: {}
  }).then(res=>res.result && res.result['data'])
}

export default {
  init,
  getCurrentUser,
  getPhoneNumber,
  updateUserInfo,
  onPay,
  readConfig,
  sendMsg
}