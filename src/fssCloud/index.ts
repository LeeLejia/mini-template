import leanCloud from './cloud'
import miniApp from './mini'
import cache from './cache'
import { InitOption } from './interface'
import { State } from './state'
import abTest from './abTest'
let state: State = new State()

function init(option: InitOption) {
  leanCloud.init(option)
  miniApp.init(option)
  abTest.init(option.testAb.appKey, option.testAb.clientId, option.testAb.option)
  state.setDebugger(option.isDebugger)
}

export default {
  ...leanCloud,
  ...cache,
  ...miniApp,
  abTest,
  state,
  init
}