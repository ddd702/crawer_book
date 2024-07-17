#!/usr/bin/env node

const startFetch = require('./fetchBook.cjs');
const fs = require('fs-extra');
const path = require('path');
const args = process.argv.slice(2)
console.log(`your arguments is :${args}`)
async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
async function loopWithSleep(dataConf) {
  for (let i = 0; i < dataConf.length; i++) {
    startFetch(dataConf[i]);
    await sleep(300); // Replace 1000 with the desired delay in milliseconds
  }
}
if(process.argv[1]===path.resolve(__dirname,'index.cjs')){
  console.warn('You are using "node index.cjs" to run this script');
}else{
  console.log('You are using "getbook" to run this script');
}
if(args.length===0){
  console.log('Please input the book name')
  process.exit(1);
}else{
  fs.ensureDirSync(path.resolve(process.cwd(),'assets'));//先判断下有无生成目录，没有会创建
  if(args[0]==='-c'){
    const dataStr = fs.readFileSync(path.resolve(process.cwd(),args[1]),'utf8')

    const dataConf = JSON.parse(dataStr);

    loopWithSleep(dataConf);
  }else if(args[0]==='-v'||args[2]==='-version'){
    const pkgJson = require('./package.json');
    console.log('version:'+pkgJson.version);
  }else{
    startFetch(args[0]);
  }
}

