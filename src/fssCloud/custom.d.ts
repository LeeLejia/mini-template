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
    },
    Car: {
      factor: string
    }
  }

  namespace AbTest {
    // string、number、boolean
    export type Var = {
      version: string,
      pic: string,
      aaa: number
    }
    export type Index = {
      version_a_click_count: number
    }
  }
}