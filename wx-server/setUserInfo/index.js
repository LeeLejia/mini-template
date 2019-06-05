
if (!process.env.cloudEnv) {
  throw new Error('未添加环境变量 cloudEnv')
}

const cloud = require('wx-server-sdk')
cloud.init({
  env: process.env.cloudEnv
})

/**
 * 设置用户信息
 */
exports.main = async (event, context) => {
  const { OPENID, APPID, UNIONID } = cloud.getWXContext()
  if(!event.openid && !OPENID) {
    return {
      status: false,
      msg: '不存在openid'
    }
  }
  // 获取用户信息
  const db = cloud.database()
  let user = null
  if(event.unionid || UNIONID) {
    const { data } = await db.collection('user').where({
      unionid: event.unionid || UNIONID
    }).limit(1).get()
    user = data && data[0]
  } else {
    const { data } = await db.collection('user').where({
      openid: event.openid || OPENID
    }).limit(1).get()
    user = data && data[0]
  }
  if(user) {
    delete user._id
  }
  delete event.userInfo
  const data = Object.assign({}, user, event , {updated_at: db.serverDate()})
  let result = await db.collection('user').where({
    openid: event.openid || OPENID
  }).update({
    data: data
  })
  return {
    status: true,
    data: result,
    msg: '操作成功'
  }
}