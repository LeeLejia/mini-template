if (!process.env.cloudEnv) {
  throw new Error('未添加环境变量 cloudEnv')
}

const cloud = require('./node_modules/wx-server-sdk')
cloud.init({
  env: process.env.cloudEnv
})

/**
 * 获取小程序一维码
 */
exports.main = async (event, context) => {
  if (!event.scene) {
    return { status: false, msg: '场景信息不能为空！' }
  }
  // 一维码信息
  let scene = event.scene,
    page = event.page,
    width = event.width || 430,
    auto_color = event.auto_color || false,
    line_color = event.line_color || { "r": 0, "g": 0, "b": 0 },
    is_hyaline = event.is_hyaline || false

  // 请求微信获取图像
  let {
    buffer,
    errcode,
    contentType
  } = await cloud.openapi.wxacode.getUnlimited({
    scene,
    width,
    page,
    auto_color,
    line_color,
    is_hyaline
  })
  if (errcode !== 0) {
    return { status: false, msg: '调用失败！' }
  }
  return {
    status: true,
    data: {
      url: `data:image/jpg;base64,${new Buffer(buffer).toString('base64')}`,
      contentType
    },
    msg: '操作成功！'
  }
}
