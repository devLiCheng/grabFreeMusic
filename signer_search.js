
// 通过输入歌星去搜索歌星的歌曲，搜索结果可能是分页的，需要翻页处理
const signer_search = async ({page, keywords,}) => {
    let pageNumber = 1; // 默认第一页
    const className = ".pagination li:nth-last-child(2)"; // 如果是数字那么说明有翻页，翻页的总量也就是这个类的innerText
    const pageUrl = (keywords, pageNumber) => `https://xiageba.com/s/${keywords}/${pageNumber}`
    let url = pageUrl(keywords, pageNumber);
    await page.goto(url);
    // Set screen size
    await page.setViewport({width: 1080, height: 1024});
    const havePagination = await page.$eval(className, el => el.innerText ? Number(el.innerText) : 0)
    const detailUrls = []; // 存放详情页的url
    // 获取当前页面的所有链接并返回
    const queryCurrentPageLinks = async () => {
        // 将每一页要跳转到下一页，也就是详情页的url，先存起来，直至最后一页也就是havePagination这页
        const findAHref= ".search-item .link-blue";
        const currentPageLink = await page.$$eval(findAHref, links => links.map(link => link.href));
        return currentPageLink;
    }
    if(havePagination){ // 有翻页，翻页的总量也就是 havePagination
        // 翻页
        for(; pageNumber <= havePagination; pageNumber++){    // 翻页的总量
            // pageNumber = i;
            url = pageUrl(keywords, pageNumber)  // 构造翻页的url
            await page.goto(url);
            const dataLink = await queryCurrentPageLinks()
            detailUrls.push(...dataLink);    // 存放详情页的url
        }
    } else { // 没有翻页
        const data = await queryCurrentPageLinks()
        detailUrls.push(...data);
    }
    return detailUrls;
}

module.exports = signer_search