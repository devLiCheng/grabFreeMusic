const path = require("path");
const fs = require("fs");
const axios = require("axios");
// const fetch = require('node-fetch');
const https = require("https");
const { exec } = require("child_process");
const request = require("request");
const http = require("http");
const { timeout } = require("puppeteer");
const util = require("util");

const lanzoui_download = async ({ page, url, code, singer_title }, browser) => {
  await await page.goto(url);
  const pages = await browser.pages();
  const loginPage = pages[1];
  // 等待登录页面加载完成
  await loginPage.bringToFront();

  // 等待输入框加载完成并插入内容
  await page.waitForSelector('input[type="text"]');
  await page.type('input[type="text"]', code);
  // 点击按钮 去验证code是否正确
  await page.click(".passwddiv-btn");

  // const downloadPath = path.resolve(__dirname, 'music');
  // console.log('downloadPath', downloadPath)
  // await page.setDownloadPath(downloadPath);

  // 监听下载事件（可选，用于跟踪下载进度）
  //  page.on('download', async (download) => {
  //   console.log('文件开始下载：', download.suggestedFilename());
  //   // 等待下载完成
  //   const downloadPath = await download.path();
  //   console.log('文件已下载到：', downloadPath);
  // });

  // const downloadPath = path.resolve(__dirname, 'music');
  // await page._client.send('Page.setDownloadBehavior', {
  //   behavior: 'allow',
  //   downloadPath: downloadPath,
  // });

  // 等待1秒
  await page.waitForSelector("#downajax", { visible: true });

  await page.click("#downajax", { visible: true });

  await new Promise((resolve) => setTimeout(resolve, 1000)); // 等待5秒

  // 源目录，即你的下载文件夹
  const sourceDir = "C:\\Users\\lc\\Downloads";

  // 目标目录，即你的项目的music文件夹
  const targetDir = path.join(__dirname, "music"); // 假设脚本在项目的根目录下

  // 确保目标目录存在，如果不存在则创建它
  fs.mkdir(targetDir, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Directory created successfully");
    }
  });

  const readdirFn = async (srcDir, callback) => {
    try {
      await fs.readdir(srcDir, (err, files) => {
        if (err) {
          return callback(err);
        } else {
          // console.log("files---->", files);
          return callback(null, files);
        }
      });
    } catch (error) {
      return callback(error);
    }
  };

  const saveFile = async (files = [], srcDir, destDir) => {
    for (const entry of files) {
      const sourceFile = path.join(srcDir, entry);
      const targetFile = path.join(destDir, entry);
      if (path.extname(entry).toLowerCase() === ".zip") {
        // 使用 util.promisify 将 fs.copyFile 转换为 Promise API
        const copyFile = util.promisify(fs.copyFile);
        // 复制文件
        copyFile(sourceFile, targetFile)
          .then(() => {
            console.log("文件复制成功！");
            // 删除原始文件
            fs.unlink(sourceFile, (err) => {
              if (err) {
                console.error("删除原始文件时出错:", err);
              } else {
                console.log("原始文件已删除。");
              }
            });
          })
          .catch((err) => {
            console.error("复制文件时出错:", err);
          });
        console.log(`文件已移动: ${sourceFile} -> ${targetFile}`);
      }
    }
  };

  // 移动源目录下的所有.zip文件到目标目录
  async function moveZipFiles(srcDir, destDir) {
    // const entries = await fs.readdir(srcDir, { withFileTypes: true });
    await readdirFn(srcDir, async (err, files) => {
      if (err) {
        console.log("读取文件错误", err);
      } else {
        console.log("files----->", files);
        await saveFile(files, srcDir, destDir);
      }
    });
  }

  // 开始移动.zip文件
  moveZipFiles(sourceDir, targetDir)
    .then(() => {
      console.log("所有.zip文件已移动到目标目录");
    })
    .catch((error) => {
      console.error("移动文件时发生错误:", error);
    });

  // console.log('downloadLink', downloadLink)
  // if(downloadLink){
  //   await page.goto(downloadLink, {
  //     timeout: 0,
  //     // waitUntil: 'networkidle0'
  //   });
  // }

  // await page.screenshot({ path: 'example.png' });

  // await page.click("#downajax", { visible: true });
  // await page.waitForSelector("#downajax", { visible: true });
  // await page.click("#downajax");

  // await page.goto(downloadLink)

  // const downloadFile = (url, filePath) => {
  //   return new Promise((resolve, reject) => {
  //     const fileStream = fs.createWriteStream(filePath);
  //     http.get(url, (response) => {
  //       response.pipe(fileStream);
  //       fileStream.on('finish', () => {
  //         fileStream.close(resolve);  // close() is async, resolve after close completes
  //       });
  //     }).on('error', (err) => {
  //       fs.unlink(filePath, () => {  // Delete the file async. (But we don't check the result)
  //         reject(err);
  //       });
  //     });
  //   });
  // }

  // downloadFile(downloadLink, "z.zip")
  // .then(() => console.log('File downloaded successfully'))
  // .catch((err) => console.error('Error downloading file:', err));

  // 设置下载路径为当前项目的 music 文件夹下
  // const downloadPath = path.resolve(__dirname, 'music');
  // await page.evaluate(downloadPath => {
  //   const script = document.createElement('script');
  //   script.innerHTML = `
  //     window.addEventListener('DOMContentLoaded', () => {
  //       chrome.send('Page.setDownloadBehavior', {
  //         behavior: 'allow',
  //         downloadPath: '${downloadPath}',
  //       });
  //     });
  //   `;
  //   document.head.appendChild(script);
  // }, downloadPath);

  // 触发下载
  // await page.evaluate(() => {
  //   // 通过点击下载按钮触发下载
  //   document.querySelector('#downajax').click();
  // });

  // console.log("downloadLink", downloadLink);

  // if (downloadLink) {
  //   // 创建 music 文件夹
  //   const musicFolderPath = path.join(__dirname, "music");
  //   if (!fs.existsSync(musicFolderPath)) {
  //     fs.mkdirSync(musicFolderPath);
  //   }

  // const downloadFile = async (url, outputDir) => {
  //   try {
  //     const response = await axios({
  //       url: url.replace(/^http:/, "https:"), // 将 URL 中的 HTTP 协议替换为 HTTPS 协议 HTTPS 协议
  //       method: "GET",
  //       responseType: "stream",
  //       headers: {
  //         "User-Agent": "Mozilla/5.0", // 添加用户代理头部
  //       },
  //     });

  //     // 获取文件名
  //     let fileName = "downloaded_file"; // 默认文件名
  //     const contentType = response.headers["content-type"];
  //     const contentTypeParts = contentType.split("/");
  //     if (contentTypeParts.length === 2) {
  //       const fileExtension = contentTypeParts[1];
  //       fileName += `.${fileExtension}`;
  //     }
  //     const outputPath = path.join(outputDir, fileName);

  //     const writer = fs.createWriteStream(outputPath);

  //     response.data.pipe(writer);

  //     return new Promise((resolve, reject) => {
  //       writer.on("finish", resolve);
  //       writer.on("error", reject);
  //     });
  //   } catch (error) {
  //     throw new Error(`Failed to download file: ${error.message}`);
  //   }
  // };

  // const downloadFile = (url, outputDir) => {
  //   return new Promise((resolve, reject) => {
  //     const options = {
  //       url: url,
  //       headers: {
  //         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
  //       }
  //     };

  //     const fileName = path.basename(url).replace(/\?/g, '_');
  //     const outputPath = path.join(outputDir, fileName);

  //     const fileStream = fs.createWriteStream(outputPath);
  //     const req = request.get(options);

  //     req.on('response', (response) => {
  //       if (response.statusCode !== 200) {
  //         reject(new Error(`Failed to download file: ${response.statusMessage}`));
  //         return;
  //       }

  //       req.pipe(fileStream);

  //       fileStream.on('finish', () => {
  //         fileStream.close(resolve);
  //       });

  //       fileStream.on('error', (error) => {
  //         fs.unlink(outputPath, () => {
  //           reject(new Error(`Failed to download file: ${error.message}`));
  //         });
  //       });
  //     });

  //     req.on('error', (error) => {
  //       reject(new Error(`Failed to download file: ${error.message}`));
  //     });
  //   });
  // };

  // downloadFile(downloadLink, musicFolderPath)
  //   .then(() => {
  //     console.log("文件下载完成。");
  //   })
  //   .catch((error) => {
  //     console.error("下载文件时出错：", error);
  //   });

  // // 监听下载事件
  // page.on("download", async (download) => {
  //   console.log("是否会进入这里", download)
  //   const url = download.url();
  //   const filename = download.suggestedFilename();
  //   const savePath = path.join(musicFolderPath, filename);
  //   console.log(`Downloading ${filename}...`);
  //   await download.saveAs(savePath);
  //   console.log(`Downloaded ${filename} to ${savePath}`);
  // });

  //   await page.click("#downajax", {visible: true})
  //   // 等待下载完成的网络请求
  //   const response = await page.waitForResponse(response => {
  //     return response.url().startsWith('https://c1026.lanosso.com');
  // });
  //   // 获取文件名
  //   const contentDisposition = response.headers()['content-disposition'];
  //   const filenameMatch = /filename="([^"]+)"/.exec(contentDisposition);
  //   const filename = filenameMatch ? filenameMatch[1] : 'downloaded_file';

  // 保存文件
  // const savePath = path.join(musicFolderPath, filename);
  // const buffer = await response.buffer();
  // fs.writeFileSync(savePath, buffer);

  // 获取当前时间作为文件名
  // const currentTime = new Date()
  //   .toISOString()
  //   .replace(/:/g, "-")
  //   .split(".")[0];
  // const extension = downloadLink.split(".").pop(); // 获取下载链接的文件扩展名

  // async function downloadFile(url, dest) {
  //   const writer = fs.createWriteStream(dest);
  //   return new Promise((resolve, reject) => {
  //     axios({
  //       method: "get",
  //       url: url,
  //       responseType: "stream", // 指示axios返回响应流
  //       // httpsAgent: new https.Agent({ rejectUnauthorized: false }) // 如果需要忽略SSL错误，可以添加这个选项
  //     })
  //       .then((response) => {
  //         response.data.pipe(writer);
  //         return new Promise((resolve, reject) => {
  //           writer.on("finish", resolve);
  //           writer.on("error", reject);
  //         });
  //       })
  //       .then(() => {
  //         console.log("文件下载完成:", dest);
  //         resolve();
  //       })
  //       .catch((error) => {
  //         console.error("文件下载失败:", error);
  //         reject(error);
  //       });
  //   });
  // }

  // const outputPath = path.join(
  //   __dirname,
  //   "music"
  // );

  // 批量下载函数
  // async function downloadFiles(urls, downloadDir) {
  //   let fileName  = new Date().getTime() + ".zip"; // 随机生成文件名
  //   for (let url of urls) {
  //       try {
  //           const response = await axios.get(url, { responseType: 'arraybuffer' });

  //           const contentDisposition = response.headers['content-disposition'];
  //           if (contentDisposition && contentDisposition.includes('filename=')) {
  //             const regex = /filename="(.+?)"/;
  //             const matches = contentDisposition.match(regex);
  //             if (matches && matches.length > 1) {
  //                 fileName = matches[1];
  //             }
  //           }

  //           const filePath = path.join(downloadDir, fileName);

  //           // 创建可写流并将响应管道到文件
  //           const writer = fs.createWriteStream(filePath);
  //           response.data.pipe(writer);

  //           // 等待文件写入完成
  //           await new Promise((resolve, reject) => {
  //               writer.on('finish', resolve);
  //               writer.on('error', reject);
  //           });

  //           console.log(`文件已下载至: ${filePath}`);
  //       } catch (error) {
  //           console.error(`下载文件失败---?: ${url}`, error);
  //       }
  //   }
  // }

  // 调用下载函数
  // await downloadFiles([downloadLink], outputPath);

  // 下载链接内容到当前目录的 music 文件夹中，并以当前时间命名文件
  // const response = await page.goto(downloadLink);
  // const buffer = await response.buffer();
  // const filename = path.join(musicFolderPath, `${singer_title}_${currentTime}.${extension}`);
  // fs.writeFileSync(filename, buffer);

  // console.log('Downloaded music file:', filename);
  // } else {
  //   console.log("Download link not found.");
  // }
};

module.exports = lanzoui_download;
