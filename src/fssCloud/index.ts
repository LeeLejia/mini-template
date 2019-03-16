import leanCloud from './cloud'
import miniApp from './mini'
import cache from './cache'
import { InitOption } from './interface'
import { State } from './state'
let state: State = new State()

function init(option: InitOption) {
  leanCloud.init(option)
  miniApp.init(option)
  state.setDebugger(option.isDebugger)
}


export default {
  ...leanCloud,
  ...cache,
  ...miniApp,
  state,
  init
}