const puppeteer  = require('puppeteer');
const fs = require('fs');
const path = require('path');
const signer_search = require("./signer_search")
const saveDetail = require("./saveDetail")
const lanzoui_download = require("./lanzoui_download")
const getJsonFiles = require("./getJsonFiles")

const main = async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: false, // 设置为false以显示浏览器界面  
    devtools: true,  // 打开开发者工具，可选  
    slowMo: 0,     // 减缓Puppeteer的操作速度，便于观察，可选
  });
  const page = await browser.newPage();

  // const signer_links = await signer_search({page, keywords: '冷漠'}) // 获取所有周杰伦歌曲的详情的链接
  // // 通过 keywords 搜索出所有的结果链接，并遍历每个链接，将结果保存到本地
  // if(Array.isArray(signer_links) && signer_links.length > 0){
  //   for(let i = 0; i < signer_links.length; i++) {
  //     const { code, reslt } = await saveDetail({page, url: signer_links[i]});
  //     console.log('code', code)
  //     console.log('reslt', reslt)
  //   }
  // } else {
  //   console.log('没有找到相关歌曲')
  // }

  const jsonFiles = await getJsonFiles() // 获取本地保存的json文件列表
  if(Array.isArray(jsonFiles) && jsonFiles.length > 0){
    for(let file of jsonFiles){
      const filename = path.join(__dirname, file);
      const fileContent = fs.readFileSync(filename, 'utf8');
      const jsonData = JSON.parse(fileContent); // 拿到这个文件里面的所有要下载的内容
      if(Array.isArray(jsonData) && jsonData.length > 0){
        jsonData.forEach(async (item) => {
          const params = {
            url: item.lanzoui_pan[0], 
            code: item.lanzoui_pan_code[0], 
            singer_title: item.singer_title[0]
          };
          if(Object.keys(params).every(key => params[key] !== undefined && params[key] !== '')) {
            await lanzoui_download({page, ...params})
          }
        })
      }
    }
  }



  // console.log('reslt', reslt)

  // const { code } = await saveDetail({page});

  // if(code === 0){
  //   // await browser.close();
  // }

}


main();