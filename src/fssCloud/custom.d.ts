declare namespace FssCloud {

  export type Cache = {
    Person: {
      userInfo: AV.User
    }
  }

  export type State = {
    Person: {
      hasLogin: boolean,
      userInfo: DataType.UserInfo
    }
  }
}