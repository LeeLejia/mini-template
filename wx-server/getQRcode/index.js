// 云函数入口文件
const QRCode = require('qrcode')

/**
 * 生成二维码
 */
exports.main = async (event, context) => {
  if (!event.text) {
    return { status: false, msg: '失败,请稍后重试！' }
  }
  const options = {
    width: event.width || 400,
    height: event.height || 400,
    scale: event.scale || 4,
    margin: event.margin || 4,
    color: {
      dark: event.colorDark || '#000000ff',
      light: event.colorLight || '#ffffffff'
    }
  }
  const result = await QRCode.toDataURL(event.text, options)
  return {
    status: true,
    data: result,
    msg: '生成二维码成功'
  }
}