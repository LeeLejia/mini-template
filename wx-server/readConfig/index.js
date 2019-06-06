if(!process.env.cloudEnv) {
  throw new Error('未添加环境变量 cloudEnv')
}

// 云函数入口文件
const cloud = require('./node_modules/wx-server-sdk')

cloud.init({
  env: process.env.cloudEnv
})
const db = cloud.database()

async function readDoc(collection, id) {
  return new Promise((resolve, reject)=>{
    db.collection(collection).doc(id).get().then(res=>{
      resolve(res.data)
    }).catch(err=>{
      resolve(null)
    })
  })
}

/**
 * 读取配置信息，管理员给用户设置的信息
 */
exports.main = async (event, context) => {
  let { OPENID } = cloud.getWXContext()
  const allConfig = await readDoc('config', 'appConfig')
  const {config: userConfig} = await readDoc('_session', event.openid || OPENID)
  delete allConfig._id
  return {
    status: true,
    data: Object.assign({}, allConfig, userConfig),
    msg: '读取配置成功'
  }
}