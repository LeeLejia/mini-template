if (!process.env.cloudEnv) {
  throw new Error('未添加环境变量 cloudEnv')
}
if (!process.env.mchId) {
  throw new Error('未添加环境变量 mchId')
}
if (!process.env.mchKey) {
  throw new Error('未添加环境变量 mchKey')
}
if (!process.env.notifyUrl) {
  console.warn('未设置环境变量 notify_url')
}

const WXPay = require('weixin-pay') // API参考: https://github.com/zhbo/wxpay
const cloud = require('wx-server-sdk')
cloud.init({
  env: process.env.cloudEnv
})

const mch_key = process.env.mchKey //这是商户的key，不是小程序的密钥。32位，必须大写。
const mch_id = process.env.mchId //你的商户号

exports.main = async (event, context) => {
  if ((!Array.isArray(event.goodsIds) || event.goodsIds.length === 0) && !event.goodsId) {
    return {
      status: false,
      msg: '未提供商品Id'
    }
  }
  const goodsList = event.goodsIds || [event.goodsId]
  const { OPENID: openid, APPID: appid, UNIONID } = cloud.getWXContext()
  const db = cloud.database()
  const goodsResult = []
  for (let i = 0; i < goodsList.length; i++) {
    if(!goodsList[i].id || (goodsList[i].count && goodsList[i].count < 1)) {
      return {
        status: false, 
        msg: `商品(Id${goodsList[i].id})参数错误！`
      }
    }
    try {
      const item = await db.collection('goods').doc(goodsList[i].id).get()
      const count = goodsList[i].count || 1
      goodsResult.push({goods: item.data, count, sum: item.data.cost * count})
    }catch(err) {
      return {
        status: false, 
        msg: `找不到商品Id${goodsList[i].id}`
      }
    }
  }

  const wxpay = WXPay({
    appid,
    mch_id: mch_id,
    partner_key: mch_key,
    // pfx: fs.readFileSync('./wxpay_cert.p12'), //微信商户平台证书，暂不需要
  })
  const firstGoods = goodsResult[0].goods
  const payDesc = goodsResult.length === 1? `购买商品 ${firstGoods.name}${goodsResult[0].count>1?' * '+ goodsResult[0].count: ''}`: `购买${firstGoods.name}等${goodsResult.length}件商品`
  const total = goodsResult.reduce((sum, item)=>sum + item.goods.cost * item.count, 0)
  return new Promise((resolve, reject) => {
    wxpay.createUnifiedOrder({
      openid,
      body: payDesc,
      detail: payDesc,
      out_trade_no: "otn" + parseInt(Date.now() / 1000) + Math.random().toString(10).substr(2, 15),
      total_fee: total,
      spbill_create_ip: '127.0.0.1',
      notify_url: process.env.notifyUrl || '',
      trade_type: 'JSAPI',
    }, function (err, results) {
      if (err) {
        resolve({
          status: false,
          msg: err
        })
        return 
      }
      if (results.result_code !== 'SUCCESS') {
        resolve({
          status: false,
          msg: results
        })
        return 
      }
      const sign = wxpay.sign(results)
      if (sign !== results.sign) {
        const err = new Error('微信返回参数签名结果不正确')
        err.code = 'INVALID_RESULT_SIGN'
        resolve({
          status: false,
          msg: err
        })
        return 
      }
      // console.log(`预订单创建成功! 订单号=${results.tradeId},prepayId=${results.prepay_id}`)
      const payload = {
        appId: appid,
        timeStamp: String(Math.floor(Date.now() / 1000)),
        package: `prepay_id=${results.prepay_id}`,
        signType: 'MD5',
        nonceStr: String(Math.random()),
      }
      payload.paySign = wxpay.sign(payload)
      resolve({
        status: true,
        data: payload,
        msg: '创建订单成功'
      })
      return
    })
  })
}
