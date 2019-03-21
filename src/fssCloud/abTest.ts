
import testInAB from './testin/testin-ab-weapp-v3.1.1'


let varsPromise
/**
 * appKey	string		应用授权标识
 * clientId	string	<optional>
 * (可选的)用户唯一ID, 如果没有指定,将自动生成一个随机的 clientId， 并存储在cookie中，之后该浏览器中的调用都将使用该 clientId。
 * option.crossMultiLink 开启跨域模式的多链接实验全局配置，此配置仅可在多链接模式中发生跨域的情况下使用，如果不跨域，请参考上方同域名下多链接模式示例
 * option.openOverlay 在得到变量前，开启白色的遮罩层
 * option.timeout 请求超时时间，毫秒
 * option.url 私有化部署时服务器链接
 */
type Option = { crossMultiLink?: boolean, openOverlay?: boolean, timeout?: number, url?: string }
function init(appKey: string, clientId?: string, option?: Option) {
  if (option) {
    testInAB.crossMultiLink = option.crossMultiLink || false
    option.openOverlay && testInAB.openOverlay()
    option.timeout && testInAB.setTimeout(option.timeout)
    option.url && testInAB.setUrl(option.url)
  }
  testInAB.init(appKey, clientId)
  varsPromise = new Promise(res => {
    testInAB.getVars(res)
  })
}

/**
 * 设置用户标签
 * 设置自定义受众条件。注意，setTags方法一定要在getVars方法之前调用，否则定向实验不会生效。
 * @param tags 当前用户标签，比如：{age: 20, vip: true}
 */
function setTags(tags: { [key: string]: any }) {
  testInAB.setTags(tags)
  varsPromise = new Promise(res => {
    testInAB.getVars(res)
  })
}

/**
 * 设置默认变量值，在getVars方法前调用
 * @param defVar 默认值
 */
function setDefaultVars<K extends keyof FssCloud.AbTest.Var>(defVar: { [P in K]: FssCloud.AbTest.Var[P] }) {
  testInAB.setDefVars(defVar)
}

function getVars<K extends keyof FssCloud.AbTest.Var>(key: K): Promise<FssCloud.AbTest.Var[K]> {
  return varsPromise.then(vars => {
    return vars.get(key)
  })
}

/**
 * 
 * @param index 指标名称
 * @param count 指标增量，默认1
 * @param callback 如果点击按钮同时页面跳转，后台将收不到上报的指标。可在在回调中跳转
 */
function track(index: keyof FssCloud.AbTest.Index, count?: number, callback?: () => void) {
  const increase = count?count: 1
  testInAB.track(index, increase, callback)
}

export default {
  init,
  getVars,
  setDefaultVars,
  setTags,
  track
}