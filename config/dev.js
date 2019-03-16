var path = require("path");
console.log('development mode.');
module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {},
  alias: {},
  // js混淆
  uglify: {
    enable: false,
    config: {
      // 配置项同 https://github.com/mishoo/UglifyJS2#minify-options
    }
  },
  weapp: {},
  h5: {}
};