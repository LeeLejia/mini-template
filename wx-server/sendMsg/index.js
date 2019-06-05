if (!process.env.cloudEnv) {
  throw new Error('未添加环境变量 cloudEnv')
}

const cloud = require('wx-server-sdk')

cloud.init({
  env: process.env.cloudEnv
})

/**
 * 发送模板消息
 */
exports.main = async (event, context) => {
  let { OPENID, APPID, UNIONID } = cloud.getWXContext()
  if (!event.formId || !event.templateId) {
    return {
      status: false,
      msg: '参数错误'
    }
  }
  // 发送模板消息
  await cloud.openapi.templateMessage.send({
    touser: event.openid || OPENID,
    page: event.page || '',
    data: event.data,
    templateId: event.templateId,
    formId: event.formId,
    emphasisKeyword: event.emphasisKeyword
  })
  return {
    status: true,
    msg: '发送成功！'
  }
}

// 属性	类型	默认值	必填	说明
// access_token	string		是	接口调用凭证
// touser	string		是	接收者（用户）的 openid
// template_id	string		是	所需下发的模板消息的id
// page	string		否	点击模板卡片后的跳转页面，仅限本小程序内的页面。支持带参数,（示例index?foo=bar）。该字段不填则模板无跳转。
// form_id	string		是	表单提交场景下，为 submit 事件带上的 formId；支付场景下，为本次支付的 prepay_id
// data	Object		否	模板内容，不填则下发空模板。具体格式请参考示例。
// emphasis_keyword	string		否	模板需要放大的关键词，不填则默认无放大
// 示例
// {
//   touser: 'OPENID',
//   page: 'index',
//   data: {
//     keyword1: {
//       value: '339208499'
//     },
//     keyword2: {
//       value: '2015年01月05日 12:30'
//     },
//     keyword3: {
//       value: '腾讯微信总部'
//     },
//     keyword4: {
//       value: '广州市海珠区新港中路397号'
//     }
//   },
//   templateId: 'TEMPLATE_ID',
//   formId: 'FORMID',
//   emphasisKeyword: 'keyword1.DATA'
// }