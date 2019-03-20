
let isDebugger: boolean = false

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

type callbackType<T> = (pre: undefined | T, after: undefined | T) => void
interface StateModuleInterface {
  addNotify: (key, callback) => void
  set: (key, value) => void
  remove: (key) => void
  get: (key) => any
}

interface StateInterface {
  addNotify: (module, key, callback) => void
  set: (module, key, value) => void
  get: (module, key) => any | undefined
  remove: (module, key) => void
  getModule: (module) => any | undefined
}

class StateModule<M extends keyof FssCloud.State> implements StateModuleInterface {
  private map = new Map()
  private notifiesMap = new Map()
  private name: M
  constructor(name: M) {
    this.name = name
  }
  get<K extends keyof FssCloud.State[M]>(key: K, defaultValue?: FssCloud.State[M][K]): FssCloud.State[M][K] | undefined {
    const value = this.map.get(key)
    if (isDebugger) {
      showLog(`[GET]->[${this.name}] module`, [
        { content: `key: ${key}`, style: 'color: green' },
        { content: `value: `, style: 'color: green' },
        { content: value }
      ])
    }
    return value || defaultValue
  }

  set<K extends keyof FssCloud.State[M]>(key: K, value: FssCloud.State[M][K] | undefined): void {
    const old = this.map.get(key)
    this.map.set(key, value)
    const notifies = this.notifiesMap.get(key)

    if (isDebugger) {
      showLog(`[SET]->[${this.name}] module`, [
        { content: `key: ${key}, notifyCount: ${notifies && notifies.length || 0}`, style: 'color: green' },
        { content: `[pre]`, style: 'color: green' },
        { content: old },
        { content: `[after]`, style: 'color: green' },
        { content: value }])
    }

    if (notifies) {
      notifies.forEach((callback) => {
        callback(old, value)
      })
    }
  }

  addNotify<K extends keyof FssCloud.State[M]>(key: K, callback: callbackType<FssCloud.State[M][K]>): void {
    let notifies = this.notifiesMap.get(key)
    if (!notifies) {
      this.notifiesMap.set(key, [])
      notifies = this.notifiesMap.get(key)
    }
    notifies && notifies.push(callback)
  }

  remove<K extends keyof FssCloud.State[M]>(key: K): void {
    this.map.delete(key)
    this.notifiesMap.delete(key)
  }
}

export class State implements StateInterface {

  setDebugger(_isDebugger: boolean) {
    isDebugger = _isDebugger || false
  }

  private map = new Map()

  addNotify<M extends keyof FssCloud.State, K extends keyof FssCloud.State[M]>(module: M, key: K, callback: callbackType<FssCloud.State[M][K]>): void {
    let moduleEntity = this.map.get(module)
    if (!moduleEntity) {
      this.map.set(module, new StateModule(module))
      moduleEntity = this.map.get(module)
    }
    moduleEntity && moduleEntity.addNotify(key, callback)
  }

  set<M extends keyof FssCloud.State, K extends keyof FssCloud.State[M]>(module: M, key: K, value: FssCloud.State[M][K]): void {
    let moduleEntity = this.map.get(module)
    if (!moduleEntity) {
      this.map.set(module, new StateModule(module))
      moduleEntity = this.map.get(module)
    }
    moduleEntity && moduleEntity.set(key, value)
  }

  get<M extends keyof FssCloud.State, K extends keyof FssCloud.State[M]>(module: M, key: K, defaultValue?: FssCloud.State[M][K]): FssCloud.State[M][K] | undefined {
    let moduleEntity = this.map.get(module)
    if (!moduleEntity) {
      this.map.set(module, new StateModule(module))
      moduleEntity = this.map.get(module)
    }
    return moduleEntity && moduleEntity.get(key, defaultValue) || defaultValue
  }

  getModule<M extends keyof FssCloud.State>(module: M): StateModule<M> | undefined {
    let moduleEntity = this.map.get(module)
    if (!moduleEntity) {
      this.map.set(module, new StateModule(module))
      moduleEntity = this.map.get(module)
    }
    return moduleEntity
  }

  remove<M extends keyof FssCloud.State>(module: M, key: keyof FssCloud.State[M]): void {
    const moduleEntity = this.map.get(module)
    if (moduleEntity) {
      moduleEntity.remove(key)
    }
  }

}