webpack 封装命令

设计原则： 极简，新人友好，约定大于配置。

## 前置要求

项目代码必须在 src 下，可以是monorepo 结构。

## 安装 

```
yarn add zimopack -D
```

## 启动

package.json

```json
{
    "scripts":{
        "start": "zimopack start",
        "build": "zimopack build",
        "lib": "zimopack lib",
        "report": "zimopack report"
    }
}
```

start: 启动本地开发服务

build: 构建工程

lib ：打包 es、lib 组件库

report: 分析包大小

## 自定义配置

命令行提供默认配置，如果需要自定义需要在项目根目录下建立 webpack.development.js 和 webpack.production.js

webpack.development.js

```js
module.exports = {
    webpack: {
        //custom
    }
}

```

