
if (!process.env.cloudEnv) {
  throw new Error('未添加环境变量 cloudEnv')
}

const cloud = require('wx-server-sdk')
const crypto = require('crypto')

cloud.init({
  env: process.env.cloudEnv
})

/**
 * 解密微信
 */
exports.main = async (event, context) => {
  let { OPENID, APPID, UNIONID } = cloud.getWXContext()
  const db = cloud.database()
  const res = await db.collection('_session').doc(event.openid || OPENID).get()
  // 格式化用户加密信息
  let sessionKey = new Buffer(res.data.session_key, 'base64'),
    encryptedData = new Buffer(event.encryptedData, 'base64'),
    iv = new Buffer(event.iv, 'base64')
  try {
    // 解密
    var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true)
    var decoded = decipher.update(encryptedData, 'binary', 'utf8')
    decoded += decipher.final('utf8')
    decoded = JSON.parse(decoded)
    // 假如解密出来的appid 和当前appid 不一致， 抛出错误
    if (decoded.watermark.appid !== APPID) {
      return {
        status: false,
        msg: '加密数据appid不一致'
      }
    }
    // 成功返回数据
    return {
      status: true,
      data: decoded,
      msg: '操作成功!'
    }
  } catch (err) {
    return {
      status: false,
      msg: err
    }
  }
}
