const path = require('path')
const sassImporter = function(url) {
  const reg = /^@styles\/(.*)/
  return {
    file: reg.test(url) ? path.resolve(__dirname, '..', 'src/styles', url.match(reg)[1]) : url
  }
}
const config = {
  projectName: '模版',
  defineConstants: {
    APP_NAME: '模版',
    IS_DEBUG: true
  },
  date: '2019-2-16',
  alias: {
    '@components': path.resolve(__dirname, '..', 'src/components'),
    '@pages': path.resolve(__dirname, '..', 'src/pages'),
    '@config': path.resolve(__dirname, '..', 'src/config'),
    'fsscloud': path.resolve(__dirname, '..', 'src/fssCloud'),
    '@assets': path.resolve(__dirname, '..', 'src/assets'),
    '@api': path.resolve(__dirname, '..', 'src/api'),
    '@img': path.resolve(__dirname, '..', 'src/assets/img'),
    '@utils': path.resolve(__dirname, '..', 'src/utils'),
  },
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2
  },
  rules: [
    {
      test: /.scss$/i,
      use: [
        {
          loader: 'sass-loader',
          options: {}
        },{
          loader: 'resolve-url-loder',
          options: {}
        }
      ]
    }],
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: {
    babel: {
      sourceMap: true,
      presets: [
        'env'
      ],
      plugins: [
        'transform-runtime',
        'transform-class-properties',
        'transform-object-rest-spread'
      ]
    },
    sass: {
      importer: sassImporter
    }
  },
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  weapp: {
    module: {
      postcss: {
        autoprefixer: {
          enable: true,
          config: {
            browsers: [
              'last 3 versions',
              'Android >= 4.1',
              'ios >= 8'
            ]
          }
        },
        pxtransform: {
          enable: true,
          config: {

          }
        },
        url: {
          enable: true,
          config: {
            limit: 10240 // 设定转换尺寸上限
          }
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    module: {
      postcss: {
        autoprefixer: {
          enable: true,
          config: {
            browsers: [
              'last 3 versions',
              'Android >= 4.1',
              'ios >= 8'
            ]
          }
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
