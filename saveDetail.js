const  writeSinger  = require("./writeSInger")

const saveDetail = async ({page, url = ''}) => {
    if(!url){
       alert("没有详情链接")
        return;
    }
    await page.goto(url);
    await page.setViewport({width: 1080, height: 1024});
    const downloadClass = {
      singer: '.body-box .flex-column > div:nth-child(1)', // 通过这个class找到 歌手
      singer_title: ".body-box .flex-column > div:nth-child(1)", // 歌名
      cover:  ".body-box .thumb-cover", // 封面
      tags: ".body-box .flex-wrap a" , // 标签
      lyric: ".body-box .border-top:last-child", //歌词
      baidu_pan: ".down-item:nth-child(2) >div:nth-child(1) a", //百度网盘
      baidu_pan_code:  ".down-item:nth-child(2) >div:last-child span:last-child", // 百度网盘提取码
      lanzoui_pan: ".down-item:nth-child(3) >div:nth-child(1) a", //lanzoui网盘 
      lanzoui_pan_code:    ".down-item:nth-child(3) >div:last-child span:last-child", // lanzoui 提取码
    }
    let result = {};
    // 假设你要获取所有具有 'my-class' class 名称的元素的内容  
    for(const key of Object.keys(downloadClass)){
      try {
        const txt = await page.$$eval(downloadClass[key], elements => elements.map(element => {
          return element.getAttribute("src") || element.innerText
        }));
        result[key] = txt;
        
      } catch (error) {
        console.log(error)
      }
    }
    const { code }  = await writeSinger(result)
    return {code}
  }


  module.exports = saveDetail