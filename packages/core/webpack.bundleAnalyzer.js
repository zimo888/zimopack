const {merge} = require('webpack-merge')
const production = require('./webpack.production')
const webpackBundle = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = merge(production, {
    plugins:[
        new webpackBundle({
            analyzerMode: 'static',
            reportFilename: process.cwd() + '/build-report.html',
            generateStatsFile: false,
            // statsFilename: process.cwd() + '/build-stats.json',
        })
    ]
})