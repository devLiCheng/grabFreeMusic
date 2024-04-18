const fs = require('fs');
const path = require('path');

 const writeSinger = async (newData) => {
    // 获取当前日期，并格式化成 YYYY-MM-DD 的形式
    const currentDate = new Date().toISOString().slice(0, 10);
    // 读取或创建 JSON 文件，并追加数据
    const filePath = path.join(__dirname, `${currentDate}.json`);
    let dataArray = [];

    // 判断文件是否存在
    if (fs.existsSync(filePath)) {
    // 如果文件存在，则读取文件内容
    const fileContent = fs.readFileSync(filePath, 'utf8');
    console.log(`File content: ${fileContent}`);
    // 解析文件内容为 JSON 格式
    dataArray = fileContent ? JSON.parse(fileContent) : [];
    }

    // 将新的数据追加到数组中
    dataArray.push(newData);

    // 将更新后的数组写入到文件中
   fs.writeFileSync(filePath, JSON.stringify(dataArray, null, 2));

    console.log(`Data appended to file: ${filePath}`);
    return {code : 0}

}

module.exports = writeSinger;