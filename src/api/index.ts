import fc from 'fsscloud'
import Taro from '@tarojs/taro'
import request from './request'

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
  getUserInfo,
  isSpecialModel,
  checkForUpdate,
  ...request
}