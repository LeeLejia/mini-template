import Taro from '@tarojs/taro'
 
// 缓存对象
const __cache: {[key: string]: any}  = {}

// 设置缓存
function setCache(key: string, value: any): any {
  __cache[key] = value
}

// 读缓存
function getCache(key: string, defValue: any, remain: boolean = false): any {
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
function setStorageData(storageKey: string, syncEvn: Promise<any>, callback: (data: any) => void, showLoading: boolean = false): void {
  const key = `__storageKey_${storageKey}`
  if (showLoading) {
    Taro.showLoading({title: '加载中'})
  }
  Taro.getStorage({key}).then((res)=>{callback(res.data)}).catch(err=>console.log(`读不到「${key}」缓存,${JSON.stringify(err)}`))
  syncEvn.then(res =>{
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