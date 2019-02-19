import leanCloud from './cloud'
import miniApp from './mini'
import cache from './cache'
import { InitOption } from './interface'
import { State } from './state'
const state = new State()

function init(option: InitOption) {
  leanCloud.init(option)
  miniApp.init(option)
}


export default {
  ...leanCloud,
  ...cache,
  state,
  init
}