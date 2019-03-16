// fix taro declare
namespace Taro{
  namespace getStorage {
    export type Promised = {
      data: any
    }
    export type Param = {
      key: string
    }
  }
  export declare function getStorage(OBJECT: getStorage.Param): Promise<getStorage.Promised>
}

// declare constant 
declare var APP_NAME: string