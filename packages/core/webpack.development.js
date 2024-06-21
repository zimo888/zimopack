const common = require('./webpack.common')
const webpackMerge = require('webpack-merge');
const { getCustomWebPack } = require('./getEntry');
process.env.NODE_ENV = 'development';

let config = {
  mode: 'development',
  output:{
    filename:  "static/js/[name].js"
  },
  devServer: {
    open: true,
    historyApiFallback: true,
    headers:{
      "Access-Control-Allow-Origin":"*"
    },
    hot: true,
    allowedHosts: "all",
    port: 3000
  },
  optimization: {
    minimize: false,
  },
  devtool: "source-map",
  cache: {
    type: 'filesystem',
    allowCollectingMemory: true,
  },
}

let customWebpack = getCustomWebPack('development');
if (customWebpack?.target) {
  console.log('设置环境:', customWebpack?.target)
  config.devServer.proxy = [
    {
      context: function (pathname, req) {
        let needProxy = ["/api/", "/rest/"].some(prefix => pathname.indexOf(prefix) > -1);
        if (customWebpack?.proxyContext && typeof customWebpack?.proxyContext === 'function') {
          needProxy = customWebpack?.proxyContext(pathname, req)
        }
        return needProxy
      },
      target: customWebpack?.target,
      changeOrigin: true,
      secure: false,
      router: customWebpack?.router
    },
  ]
}

module.exports = webpackMerge.merge(common,config ,
  customWebpack?.webpack || {}
);