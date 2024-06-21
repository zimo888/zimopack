const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require("webpackbar");
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { existsSync } = require('fs')
const kill = require('tree-kill');
console.log('当前打包环境:', process.env.NODE_ENV === 'development' ? '开发环境' : '生产环境');
const workspacePath = process.cwd();
//custom index
const userTemplate = path.resolve(process.cwd(), './public/index.html')
const pid = process.pid
process.on("SIGINT", () => {
  console.log("kill thread", pid);
  kill(pid, "SIGKILL")
})
module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    main: './src/index.tsx'
  },
  output: {
    path: path.resolve(workspacePath, "./build"),
    filename: "static/js/[name].[chunkhash:8].js",
    publicPath: '/',
    assetModuleFilename: 'static/images/[name].[hash][ext][query]',
    clean: true,
  },
  resolve: {
    alias: {
      '@src': path.resolve(workspacePath, './src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|jsx|tsx)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              "@babel/preset-typescript",
              "@babel/preset-react",
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ]
      },
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'less-loader' },
        ]
      },
      {
        test: /\.(sa|sc)ss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
            },
          },
        ]
      },
      {
        test: /\.(png|jpg|gif|eot|woff|ttf)$/,
        //inline 相当于 url-loader
        type: "asset/resource",
      },
      {
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        use: ["@svgr/webpack"],
        resourceQuery: { not: [/url/] },
        include: [
          /src/,
          /node_modules/
        ]
      },
      //使用 img src 引入的，svg 需要加 ?url
      {
        test: /\.svg$/,
        type: 'asset',
        resourceQuery: /url/, // *.svg?url
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: existsSync(userTemplate) ? userTemplate : path.resolve(__dirname, './public/index.html'),
      minify: {
        removeComments: true,
        removeAttributeQuotes: false,
        caseSensitive: false,
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      }
    }),
    new MiniCssExtractPlugin({
      ignoreOrder: true,
      filename:  "static/css/[name].css",
      chunkFilename: 'static/css/[name].css'
    }),
    new WebpackBar(),
  ],
  performance: { // 关闭性能提示
    hints: false,
  }
}