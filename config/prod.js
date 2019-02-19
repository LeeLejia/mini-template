const path = require('path')
console.log('production mode.')
module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
  },
  // js混淆
  uglify: {
    enable: false,
    config: {
      // 配置项同 https://github.com/mishoo/UglifyJS2#minify-options
    }
  },
  weapp: {
  },
  h5: {
  }
}