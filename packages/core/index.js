#!/usr/bin/env node
const path = require('path');
const args = process.argv.slice(2);



const runCommand = (command, args) => {
	const cp = require("child_process");
	return new Promise((resolve, reject) => {
		const executedCommand = cp.spawn(command, args, {
			stdio: "inherit",
			shell: true
		});

		executedCommand.on("error", error => {
			reject(error);
		});

		executedCommand.on("exit", code => {
			if (code === 0) {
				resolve();
			} else {
				reject();
			}
		});
	});
};



//解析参数，获取当前命令
function parseArgs(args) {
    const result  = {
        start: false,
        build: false,
        help: false,
        report: false,
        lib: false
    }
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        switch (arg) {
            case 'start':
                result.start = true;
                break;
            case 'build':
                result.build = true;
                break;
            case 'report':
                result.report = true;
                break;
            case 'lib':
                result.lib = true;
                break;    
            case '--help':
                result.help = true;
                break;
            default:
                break;
        }
    }
    return result
}

function usage(){
    console.log(`
    zimopack <选项>
    选项:
        start       启动命令
        build       构建命令
        report      webpack bundleAnalyzer
        lib         构建lib、es 组件库
        help        帮助命令
    `)
}


const argv = parseArgs(args);

//没有传参数的时候，显示帮助文本
if(args.length === 0){
    usage();
    return;
}

if(argv.start){
    console.log('启动项目')
    require('./build_dev');
}else if(argv.build){
    console.log('打包项目');
    require('./build_prod');
}else if(argv.report){
    console.log('webpack bundleAnalyzer');
    require('./build_report');
}else if(argv.lib){
    console.log('构建lib');
    runCommand(`gulp -f ${path.resolve(__dirname, './lib_builder/gulpfile.js')} --cwd ${path.resolve(process.cwd())}`)
}

else{
    console.log('没有传参数');
    usage();
}
