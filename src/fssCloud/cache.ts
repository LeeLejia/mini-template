import Taro from '@tarojs/taro'
// import './custom.d'

// 缓存对象
const __cache: { [key: string]: any } = {}

// 设置缓存
function setCache<T extends keyof FssCloud.Cache>(key: T, value: FssCloud.Cache[T] | undefined) {
  __cache[key] = value
}

// 读缓存
function getCache<T extends keyof FssCloud.Cache>(key: T, defValue?: FssCloud.Cache[T], remain: boolean = false): FssCloud.Cache[T] | undefined {
  if (__cache[key] === false || __cache[key] === 0) {
    const value = __cache[key]
    if (!remain) {
      delete __cache[key]
    }
    return value
  }
  const value = __cache[key] || defValue
  if (!remain) {
    delete __cache[key]
  }
  return value
}

// 缓存异步数据
function setStorageData<T>(
  storageKey: string,
  syncEvn: Promise<T>,
  callback: (data: T) => void,
  showLoading: boolean = false): void {
  const key = `__storageKey_${storageKey}`
  if (showLoading) {
    Taro.showLoading({ title: '加载中' })
  }
  Taro.getStorage({ key }).then(res => {
    callback && callback(res.data)
  }
  ).catch(err => {
    console.log(`读不到「${key}」缓存, ${JSON.stringify(err)}`)
  })
  syncEvn.then(res => {
    showLoading && Taro.hideLoading()
    Taro.setStorage({
      key,
      data: res
    })
    return res
  }).then(callback)
}

export default {
  setCache,
  getCache,
  setStorageData
}