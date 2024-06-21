const ts = require('typescript');
const glob = require('glob');
const path = require('path');
const copyfiles = require('copyfiles');
const { existsSync ,writeFileSync} = require('fs');
const { resolveTsPaths } = require("resolve-tspaths");



 let baseConfig = {
  noImplicitAny: true,
  experimentalDecorators: true,
  lib: [ "dom",
          "dom.iterable",
          "esnext",
          "es6",
          "ES2015"],
  resolveJsonModule: true,
  esModuleInterop: true,
  allowJs: true,
  skipLibCheck: true,
  allowSyntheticDefaultImports: true,
  forceConsistentCasingInFileNames: true,
  noFallthroughCasesInSwitch: true,
  importHelpers: true, 
  resolveJsonModule: true,
  isolatedModules: true,
  //字面量都要转成ts常量
  jsx: ts.JsxEmit.React,
  rootDir: path.relative(process.cwd(), "./src"),
  declaration: true,
}



const targetLib = path.resolve(process.cwd(), 'lib')
const targetES = path.resolve(process.cwd(), 'es')


function compile(fileNames, options) {
  let program = ts.createProgram(fileNames, options);
  program.emit();
  const userTsConfig =  path.resolve(process.cwd(),'tsconfig.json');
  if(existsSync(userTsConfig)){
    console.log('发现根目录定义了tsconfig, 尝试解析别名');
    resolveTsPaths({
      out:  targetES
    });
    resolveTsPaths({
      out:  targetLib
    });
  }
  
  console.log(`编译完成`);
}



function compileTs(source, callback){
  
  glob(source, function(err, files){
    console.log('编译文件: ',files);
    console.log('1.开始编译lib');
    compile(files, {
      ...baseConfig,
      target: ts.ScriptTarget.ES2017,
      module: ts.ModuleKind.CommonJS,
      outDir: targetLib
    });
  
    console.log('2.开始编译ESModule');
    compile(files, {
      ...baseConfig,
      noImplicitAny: true,
      target: ts.ScriptTarget.ES2017,
      module: ts.ModuleKind.ES2015,
      outDir: targetES
    });
    
    console.log('3.开始复制非JS文件');
    copyfiles(['src/**/*', 'lib/'],{
      verbose: false,
      exclude:['**/*.js','**/*.ts','**/*.tsx','**/*.json','**/*.less','**/*.scss'],
      //向上一层，不包含src
      up: 1,
      all: true
    },()=>{
      console.log('复制非JS文件到lib完成')
    });
  
    copyfiles(['src/**/*', 'es/'],{
      verbose: false,
      exclude:['**/*.js','**/*.ts','**/*.tsx','**/*.json','**/*.less','**/*.scss'],
      //向上一层，不包含src
      up: 1,
      all: true
    },()=>{
      console.log('复制非JS文件到es完成')
    });
  
    //检查package.json 是否含es、lib,没有加上
    const packagePath = path.resolve(process.cwd(), 'package.json')
    if(existsSync(packagePath)){
      let pakage = require(packagePath);
      if(!pakage.main || !pakage.module || !pakage.typings || pakage?.files.indexOf('lib') === -1 || pakage?.files.indexOf('es') === -1){
        console.log('补齐 package.json, 增加模块入口');
        pakage.main = 'lib/index.js';
        pakage.module = 'es/index.js';
        pakage.typings = 'lib/index.d.ts'
        if(!Array.isArray(pakage?.files)){
          pakage.files = []
        }
        if(pakage?.files.indexOf('lib') === -1){
          pakage.files.push('lib')
        }
        if(pakage?.files.indexOf('es') === -1){
          pakage.files.push('es')
        }
        writeFileSync(packagePath,JSON.stringify(pakage,null,2));
      }
    }
    callback && callback();
  });
}


module.exports = {
  compileTs,
  baseConfig
} 