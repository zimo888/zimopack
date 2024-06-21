const path = require('path');
const { existsSync } = require('fs');
const common = require('./webpack.common.js')
/**
 * 优先用户自定义的 webpack.development.js
 */
function getCustomWebPack(env='development'){
    const customWebpackPath = path.resolve(process.cwd(),`webpack.${env}.js`)
    if(existsSync(customWebpackPath)){
        let customWebpack = require(customWebpackPath);
        if(typeof customWebpack === 'function'){
            customWebpack =  customWebpack(common)
        }
        return customWebpack;
    }
    return null;
}

module.exports = {
    getCustomWebPack
}