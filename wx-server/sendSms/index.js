if (!process.env.cloudEnv) {
  throw new Error('未添加环境变量 cloudEnv')
}

if (!process.env.accessKeyId) {
  throw new Error('未添加环境变量 accessKeyId')
}

if (!process.env.secretAccessKey) {
  throw new Error('未添加环境变量 secretAccessKey')
}

const cloud = require('wx-server-sdk')
const SMSClient = require('@alicloud/sms-sdk')

let smsClient = new SMSClient({ accessKeyId: process.env.accessKeyId, secretAccessKey: process.env.secretAccessKey })

cloud.init({
  env: process.env.cloudEnv
})


// 云函数入口函数
/**
 * 发送模板消息
 */
exports.main = async (event, context) => {
  let { OPENID, APPID, UNIONID } = cloud.getWXContext()
  const db = cloud.database()
  if (!event.phone) {
    return { status: false, msg: '手机不能为空！' }
  }
  if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(event.phone)) {
    return { status: false, msg: '手机号码格式错误！' }
  }
  // 获取数据
  let { data } = await db.collection('sms-record').where({
    phone: event.phone,
    openid: OPENID,
    is_used: 1
  }).orderBy('created_at', 'desc').skip(0).limit(1).get(),
    code = null
  // 计算时间
  if (data.length != 0 && (Number(new Date()) - Number(new Date(data[0].created_at))) < 60000) {
    return { status: false, msg: '一分钟内，不能重复发送！' }
  } else if (data.length != 0 && (Number(new Date()) - Number(new Date(data[0].created_at))) < 1800000) {
    code = data[0].code
  } else {
    // 生成六位随机数
    code = Math.floor(Math.random() * 900000) + 100000
  }
  //发送短信 
  let {
    Code
  } = await smsClient.sendSMS({
    PhoneNumbers: event.phone,
    SignName: event.SignName,
    TemplateCode: event.TemplateCode,
    TemplateParam: JSON.stringify({
      code,
      product: '云通信'
    })
  })
  if (Code !== 'OK') {
    return { status: false, msg: '发送短信失败！' }
  }
  // 新增数据
  await db.collection('sms-record').add({
    data: {
      phone: event.phone,
      code,
      openid: OPENID,
      is_used: 1,
      created_at: db.serverDate()
    }
  })
  return {
    status: true,
    msg: '操作成功！'
  }
}