const lanzoui_download = async ({page, url, code, singer_title}) => {
    await await page.goto(url);
    // 等待输入框加载完成并插入内容
    await page.waitForSelector('input[type="text"]');
    await page.type('input[type="text"]', code);
    // 点击按钮 去验证code是否正确
    await page.click('.passwddiv-btn');

    // 等待1秒
  await page.waitForTimeout(1000);

  // 获取要下载的链接
  const downloadLink = await page.evaluate(() => {
    const div = document.getElementById('downajax');
    if (div) {
      const a = div.querySelector('a');
      if (a) {
        return a.href;
      }
    }
    return null;
  });


  if (downloadLink) {
    // 创建 music 文件夹
    const musicFolderPath = path.join(__dirname, 'music');
    if (!fs.existsSync(musicFolderPath)) {
      fs.mkdirSync(musicFolderPath);
    }

    // 获取当前时间作为文件名
    const currentTime = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const extension = downloadLink.split('.').pop(); // 获取下载链接的文件扩展名

    // 下载链接内容到当前目录的 music 文件夹中，并以当前时间命名文件
    const response = await page.goto(downloadLink);
    const buffer = await response.buffer();
    const filename = path.join(musicFolderPath, `${singer_title}_${currentTime}.${extension}`);
    fs.writeFileSync(filename, buffer);
    console.log('Downloaded music file:', filename);
  } else {
    console.log('Download link not found.');
  }
}

module.exports = lanzoui_download;