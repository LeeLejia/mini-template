if(!process.env.cloudEnv) {
  throw new Error('未添加环境变量 cloudEnv')
}

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: process.env.cloudEnv
})

/**
 * 获取用户信息
 */
exports.main = async (event, context) => {
  let { OPENID, APPID, UNIONID } = cloud.getWXContext()
  const db = cloud.database()
  let userList = null
  if(event.unionid || UNIONID) {
    const { data } = await db.collection('user').where({
      unionid: event.unionid || UNIONID
    }).limit(1).get()
    userList = data
  } else {
    const { data } = await db.collection('user').where({
      openid: event.openid || OPENID
    }).limit(1).get()
    userList = data
  }
  if (!userList || userList.length === 0) {
    return {
      status: false,
      msg: '不存在该用户'
    }
  } else {
    return {
      status: true,
      data: userList[0],
      msg: '操作成功'
    }
  }
}