var gulp = require('gulp');
const path = require('path');
const sass = require('gulp-sass')(require('sass'));
const less = require('gulp-less');
const replace = require('gulp-replace');
const rimraf = require('rimraf');
const {createImporter} = require("sass-extended-importer");
const gulpResolveUrl = require('gulp-resolve-url');
var sourcemaps = require('gulp-sourcemaps');


const source =(directory)=>{
    return [
        path.resolve(process.cwd(), `${directory}/**/*.js`),
        path.resolve(process.cwd(), `${directory}/**/*.d.ts`),
    ]
}
const targetLib = path.resolve(process.cwd(), 'lib')
const targetES = path.resolve(process.cwd(), 'es')


function buildLess(cb){
    console.log('编译less.')
    gulp.src(path.resolve(process.cwd(), './src/**/*.less'))
    .pipe(less())
    .pipe(gulp.dest(targetLib))
    .pipe(gulp.dest(targetES));
    cb(); 
}

function buildSass(cb){
    console.log('编译scss.')
    gulp.src(path.resolve(process.cwd(), './src/**/*.scss'))
        //编译替换完的文件
        .pipe(sourcemaps.init())
        .pipe(sass({
            importer: createImporter({
                // options
            })
        }).on('error', sass.logError))
        .pipe(gulpResolveUrl())
        .pipe(gulp.dest(targetLib))
        .pipe(gulp.dest(targetES));
    cb();    
}

function replaceCssInES(cb){
    console.log('替换ES 中 less 和scss 的引用为css.')

    gulp.src(source('es'))
        .pipe(replace(/(require|import)\s*\(?\s*['"](.+?)\.(less|scss)['"]\s*\)?/g,(match, method, path, extension) => {
            if(method === 'import'){
                return `import '${path}.css'`;
            }
            return `${method}('${path}.css')`;
        }))
         .on('error', (error)=>{})
         .pipe(gulp.dest(targetES));
 
     cb();
 }

function replaceCssInLib(cb){
   console.log('替换lib 中 less 和scss 的引用为css.')
   gulp.src(source('lib'))
        .pipe(replace(/(require|import)\s*\(?\s*['"](.+?)\.(less|scss)['"]\s*\)?/g,(match, method, path, extension) => {
            if(method === 'import'){
                return `import '${path}.css'`;
            }
            return `${method}('${path}.css')`;
        }))
        .on('error', (error)=>{})
        .pipe(gulp.dest(targetLib));

    cb();
}


function clean(cb){
    console.log('0.删除历史构建目录');
    rimraf.sync(targetLib);
    rimraf.sync(targetES);
    cb()
}
/**
 * 编译源码的ts
 * @param {*} path 
 * @param {*} cb 
 */
function compileTs(cb){
   const {compileTs} =  require('./compile-ts');
   const tsPath = path.resolve(process.cwd(), './src/**/*')
   compileTs(tsPath,cb)
}


let gulpFlow =[
    clean,
    compileTs,
    replaceCssInES,
    replaceCssInLib,
    buildSass,
    buildLess
]

exports.default =gulp.series(gulpFlow)