const fs = require('fs');
const path = require('path');

// 获取当前文件夹下格式为 YYYY-MM-DD.json 的文件
async function getJsonFiles() {
    const files = fs.readdirSync(__dirname); // 获取当前文件夹下的所有文件名
    const jsonFiles = files.filter(file => {
      // 使用正则表达式匹配文件名是否符合 YYYY-MM-DD.json 格式
      return /^\d{4}-\d{2}-\d{2}\.json$/.test(file);
    });
    return jsonFiles;
  }
  

  module.exports = getJsonFiles;