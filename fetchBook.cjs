const fs = require('fs-extra');
const path = require('path');
const https = require('https');
const download = require('download');

const startFetch = async (bookName)=>{
  const ua=[
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
  ]
  const opt = {
    method: 'GET',
    host: 'search.douban.com',
    path: `/book/subject_search?search_text=${encodeURIComponent(bookName)}&cat=1001`,
    headers: {
      'User-Agent': ua[Math.floor(Math.random()*ua.length)],
    },
  };
  const getData = function() {
    return new Promise(resolve => {
      const reqRobot = https.request(opt, function(resRobot) {
        let body = '';
        let $ = null;
        if (resRobot.statusCode === 200) {
          resRobot.on('data', function(d) {
            body += d;
          }).on('end', function() {
            const dataExp = /window\.__DATA__ = ([\s\S]+)(?=window\.__USER__)/g
            resolve({win:body.match(dataExp)[0].replace('window.__DATA__ = ','').replace('};','}')});
          });
        } else {
          resolve({ message: '获取失败', rcode: 500 });
        }
      });
      reqRobot.end();
    });
  };
  try {
    const {win} = await getData();
    const outputData = JSON.parse(win);
    let targetItem = null;
    // console.warn('win is ',outputData);
    for (let index = 0; index < outputData.items.length; index++) {
      const ele = outputData.items[index];
      if(ele.title===bookName){
        targetItem = ele
        break
      }
    }
    if(!targetItem?.cover_url){
      targetItem = outputData.items[0]
    }
    // console.warn('targetItem is ',targetItem);
    if(targetItem.cover_url){
      const suffix = targetItem.cover_url.match(/\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff|ico)/);
      targetItem.cover ='/'+bookName.replace(/\//g,'_')+suffix[0];
      
      try {
        //fs.writeFileSync(path.join(__dirname,`assets/${targetItem.log}`), JSON.stringify(targetItem));
        fs.writeFileSync(path.join(__dirname,`assets/${targetItem.cover}`), await download(targetItem.cover_url));
        console.warn(`${bookName}： picture had downloaded,and log is deal`);
      } catch (error) {
        console.warn(`${bookName}:download err`, error.message);
      }
    }
    targetItem.log ='/'+bookName.replace(/\//g,'_')+'.log';
    fs.writeFileSync(path.join(__dirname,`assets/${targetItem.log}`), JSON.stringify(targetItem));
   
  } catch (error) {
    console.warn('getWebdata err', bookName, error.message);
  }
};

module.exports = startFetch