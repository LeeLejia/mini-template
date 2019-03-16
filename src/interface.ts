
namespace DataType {
  // 用户类型
  export type UserType = Taro.getUserInfo.PromisedPropUserInfo & {}
}

namespace State{
  export type Module = 'Person' | 'xx'
  export namespace Person{
    export const userInfo = 'userInfo'
  }
}

// todo
// interface State{
//   set<T extends State.Module>(m: T, key: keyof typeof State.Person, value): void
//   get()
// }