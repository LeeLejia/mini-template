type MS = FssCloud.State
type MN = keyof FssCloud.State
type MV = MS[MN]

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

type callbackType = (pre: undefined | MV[keyof MV], after: undefined | MV[keyof MV]) => void
interface StateModuleInterface {
  addNotify: (key: keyof MV, callback: callbackType) => void
  set: (key: keyof MV, value: MV[keyof MV] | undefined) => void
  remove: (key: keyof MV) => void
  get: (key: keyof MV) => any
}

interface StateInterface {
  addNotify: (module: MN, key: keyof MV, callback: callbackType) => void
  set: (module: MN, key: keyof MV, value: MV[keyof MV]) => void
  get: (module: MN, key: keyof MV) => MV[keyof MV] | undefined
  remove: (module: MN, key: keyof MV) => void
  getModule: (module: MN) => StateModuleInterface | undefined
}

class StateModule implements StateModuleInterface {
  private map = new Map<keyof MV, MV[keyof MV] | undefined>()
  private notifiesMap = new Map<string, callbackType[]>()
  private name: MN
  constructor(name: MN) {
    this.name = name
  }
  get<K extends keyof MV>(key: K, defaultValue?: MV[K]): MV[K] | undefined {
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

  set<K extends keyof MV>(key: K, value: MV[K] | undefined): void {
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

  addNotify<K extends keyof MV>(key: K, callback: callbackType): void {
    let notifies = this.notifiesMap.get(key)
    if (!notifies) {
      this.notifiesMap.set(key, [])
      notifies = this.notifiesMap.get(key)
    }
    notifies && notifies.push(callback)
  }

  remove<K extends keyof MV>(key: K): void {
    this.map.delete(key)
    this.notifiesMap.delete(key)
  }
}

export class State implements StateInterface {

  setDebugger(_isDebugger: boolean) {
    isDebugger = _isDebugger || false
  }

  private map = new Map<MN, StateModule>()

  addNotify<K extends keyof MV>(module: MN, key: K, callback: callbackType): void {
    let moduleEntity = this.map.get(module)
    if (!moduleEntity) {
      this.map.set(module, new StateModule(module))
      moduleEntity = this.map.get(module)
    }
    moduleEntity && moduleEntity.addNotify(key, callback)
  }

  set<K extends keyof MV>(module: MN, key: K, value: MV[K]): void {
    let moduleEntity = this.map.get(module)
    if (!moduleEntity) {
      this.map.set(module, new StateModule(module))
      moduleEntity = this.map.get(module)
    }
    moduleEntity && moduleEntity.set(key, value)
  }

  get<K extends keyof MV>(module: MN, key: K, defaultValue?: MV[K]): MV[K] | undefined {
    let moduleEntity = this.map.get(module)
    if (!moduleEntity) {
      this.map.set(module, new StateModule(module))
      moduleEntity = this.map.get(module)
    }
    return moduleEntity && moduleEntity.get(key, defaultValue) || defaultValue
  }

  getModule(module: MN): StateModule | undefined {
    let moduleEntity = this.map.get(module)
    if (!moduleEntity) {
      this.map.set(module, new StateModule(module))
      moduleEntity = this.map.get(module)
    }
    return moduleEntity
  }

  remove<K extends keyof MV>(module: MN, key: K): void {
    const moduleEntity = this.map.get(module)
    if (moduleEntity) {
      moduleEntity.remove(key)
    }
  }

}