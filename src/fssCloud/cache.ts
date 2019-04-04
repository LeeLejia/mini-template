import Taro from '@tarojs/taro'
let isDebugger: boolean = IS_DEBUG

function showLog(group: string, info: Array<{ content: any, style?: string }>) {
  console.group(group)
  info.forEach(item => {
    if (typeof item.content === 'object') {
      console.log(item.content)
    } else {
      console.log('%c' + item.content, item.style || 'color:grey')
    }
  })
  console.groupEnd()
}

// 缓存对象
const __cache: { [key: string]: any } = {}

// 设置缓存
function setCache<T extends keyof FssCloud.Cache>(key: T, value: FssCloud.Cache[T] | undefined) {
  if(isDebugger) {
    showLog(`[Cache]`, [
      { content: `set key: ${key}`, style: 'color: green' },
      { content: `pre-value`, style: 'color: yellow'},
      { content: __cache[key]?__cache[key]:'no set yet' },
      { content: `after-value`, style: 'color: yellow'},
      { content: value },
    ])
  }
  __cache[key] = value
}

// 读缓存
function getCache<T extends keyof FssCloud.Cache>(key: T, defValue?: FssCloud.Cache[T], remain: boolean = false): FssCloud.Cache[T] | undefined {
  if(isDebugger) {
    showLog(`[Cache]`, [
      { content: `get key: ${key} ${remain?'[remain]':''}`, style: 'color: green' },
      { content: `def-value`, style: 'color: yellow'},
      { content: defValue?defValue:'no set yet' },
      { content: `value`, style: 'color: yellow'},
      { content: __cache[key] },
    ])
  }
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

// 设置页面缓存
function _setPageCache(key: string, value: any) {
  if(isDebugger) {
    showLog(`[Cache]`, [
      { content: `set key: ${key}`, style: 'color: green' },
      { content: `pre-value`, style: 'color: yellow'},
      { content: __cache[key]?__cache[key]:'no set yet' },
      { content: `after-value`, style: 'color: yellow'},
      { content: value },
    ])
  }
  __cache[key] = value
}

// 读页面缓存
function _getPageCache<T>(key: string): T | undefined {
  if(isDebugger) {
    showLog(`[Cache]`, [
      { content: `get key: ${key}`, style: 'color: green' },
      { content: `value`, style: 'color: yellow'},
      { content: __cache[key] },
    ])
  }
  const value = __cache[key]
  delete __cache[key]
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
  setStorageData,
  _setPageCache,
  _getPageCache
}