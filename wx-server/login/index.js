if (!process.env.secret) {
  throw new Error('未添加环境变量 secret')
}
if (!process.env.cloudEnv) {
  throw new Error('未添加环境变量 cloudEnv')
}

const cloud = require('wx-server-sdk')
const request = require('request-promise')

cloud.init({
  env: process.env.cloudEnv
})

/**
 * 微信登录
 */
exports.main = async (event, context) => {
  if (!event.code)
    return {
      status: false,
      msg: 'code不能为空'
    }
  let { OPENID, APPID, UNIONID } = cloud.getWXContext()
  const db = cloud.database()
  const secret = process.env.secret
  const url_get_token = `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${secret}&js_code=${event.code}&grant_type=authorization_code`
  let { openid, session_key } = await request({ method: 'GET', uri: url_get_token, json: true })
  // 设置session
  db.collection('_session').doc(openid || OPENID).update({
    data: { session_key }
  })
  // 获取用户信息
  let { result: { data: user } } = await cloud.callFunction({
    name: 'getUserInfo', 
    data: { 
      openid: openid || OPENID,
      unionid: UNIONID
    }
  })
  if (user) {
    return {
      status: true,
      data: {
        user,
        hasRegister: !!user.nickName
      },
      msg: '登陆成功'
    }
  } else {
    return db.collection('user').add({
      data: {
        openid: openid || OPENID,
        unionid: UNIONID
      }
    }).then(res => {
      return {
        status: true,
        data: {
          user: {
            openid: openid || OPENID,
            unionid: UNIONID
          },
          hasRegister: false
        },
        msg: '登陆成功'
      }
    }).catch(err => {
      return {
        status: false,
        msg: err
      }
    })
  }
}