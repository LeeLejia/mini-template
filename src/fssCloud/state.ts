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

type callbackType = (pre: any, after: any) => void
interface StateModuleInterface {
  addNotify: (key: string, callback: callbackType) => void
  set: (key: string, value: any) => void
  remove: (key: string) => void
  get: (key: string) => any
}

interface StateInterface {
  addNotify: (module: string, key: string, callback: callbackType) => void
  set: (module: string, key: string, value: any) => void
  get: (module: string, key: string) => any
  remove: (module: string, key: string) => void
  getModule: (module: string) => StateModuleInterface | undefined
}

class StateModule implements StateModuleInterface {
  private map = new Map<string, any>()
  private notifiesMap = new Map<string, callbackType[]>()
  private name: string
  constructor(name: string) {
    this.name = name
  }
  get(key: string, defaultValue?: any): any {
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

  set(key: string, value: any): void {
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

  addNotify(key: string, callback: callbackType): void {
    let notifies = this.notifiesMap.get(key)
    if (!notifies) {
      this.notifiesMap.set(key, [])
      notifies = this.notifiesMap.get(key)
    }
    notifies && notifies.push(callback)
  }

  remove(key: string): void {
    this.map.delete(key)
    this.notifiesMap.delete(key)
  }
}

export class State implements StateInterface {

  setDebugger(_isDebugger: boolean) {
    isDebugger = _isDebugger || false
  }

  private map = new Map<string, StateModule>()

  addNotify(module: string, key: string, callback: callbackType): void {
    let moduleEntity = this.map.get(module)
    if (!moduleEntity) {
      this.map.set(module, new StateModule(module))
      moduleEntity = this.map.get(module)
    }
    moduleEntity && moduleEntity.addNotify(key, callback)
  }

  set(module: string, key: string, value: any): void {
    let moduleEntity = this.map.get(module)
    if (!moduleEntity) {
      this.map.set(module, new StateModule(module))
      moduleEntity = this.map.get(module)
    }
    moduleEntity && moduleEntity.set(key, value)
  }

  get(module: string, key: string, defaultValue?: any): any {
    let moduleEntity = this.map.get(module)
    if (!moduleEntity) {
      this.map.set(module, new StateModule(module))
      moduleEntity = this.map.get(module)
    }
    return moduleEntity && moduleEntity.get(key, defaultValue) || defaultValue
  }

  getModule(module: string): StateModule | undefined {
    let moduleEntity = this.map.get(module)
    if (!moduleEntity) {
      this.map.set(module, new StateModule(module))
      moduleEntity = this.map.get(module)
    }
    return moduleEntity
  }

  remove(module: string, key: string): void {
    const moduleEntity = this.map.get(module)
    if (moduleEntity) {
      moduleEntity.remove(key)
    }
  }

}