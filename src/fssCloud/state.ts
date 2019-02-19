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

  get(key: string): any {
    return this.map.get(key)
  }

  set(key: string, value: any): void {
    const old = this.map.get(key)
    this.map.set(key, value)

    const notifies = this.notifiesMap.get(key)
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
  private map = new Map<string, StateModule>()

  addNotify(module: string, key: string, callback: callbackType): void {
    const moduleEntity = this.map.get(module)
    if (moduleEntity) {
      moduleEntity.addNotify(key, callback)
    }
  }

  set(module: string, key: string, value: any): void {
    const moduleEntity = this.map.get(module)
    if (moduleEntity) {
      moduleEntity.set(key, value)
    }
  }

  get(module: string, key: string): any {
    const moduleEntity = this.map.get(module)
    if (moduleEntity) {
      return moduleEntity.get(key)
    }
  }

  getModule(module: string): StateModule | undefined {
    return this.map.get(module)
  }

  remove(module: string, key: string): void {
    const moduleEntity = this.map.get(module)
    if (moduleEntity) {
      moduleEntity.remove(key)
    }
  }

}