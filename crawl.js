const {JSDOM} = require('jsdom')

async function crawlPage(baseURL, currentURL, pages) {
    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)
    if(baseURLObj.hostname !== currentURLObj.hostname) {
        return pages
    }
    const normalizedCurrentURL = normalizeUrl(currentURL)
    if(pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++
        return pages
    }

    pages[normalizedCurrentURL] = 1
    console.log(`Crawling ${currentURL}`)

    try {
        const res = await fetch(currentURL)
        if(res.status > 399) {
            console.log(`Error in fetch with status code: ${res.status}, on page: ${currentURL}`)
            return pages
        }
        const contentType = res.headers.get('content-type')
        if(!contentType.includes("text/html")) {
            console.log(`Non html response, content-type: ${contentType}, on page: ${currentURL}`)
            return pages
        }
        const htmlBody = await res.text()
        const urls = getURLsFromHTML(htmlBody, baseURL)
        for(const url of urls) {
            await crawlPage(baseURL, url, pages)
        }
    } catch(err) {
        console.log(`Error in fetch: ${err.message}, on page: ${currentURL}`)
    }
    return pages
}
function getURLsFromHTML(htmlBody, baseURL) {
    const urls = []
    const dom = new JSDOM(htmlBody)
    const links = dom.window.document.querySelectorAll('a')
    links.forEach(link => {
        if(link.href.startsWith('/'))
        {   //Relative URL
            try{
                const urlObj = new URL(`${baseURL}${link.href}`)
                urls.push(urlObj.href)
            } catch (err){
                console.log(`Error with relative URL: ${err.message}`)
            }
        } else {
            //absolute URL
            try{
                const urlObj = new URL(link.href)
                urls.push(urlObj.href)
            } catch (err) {
                console.log(`Error with absolute URL: ${err.message}`)
            }
        }
    })
    return urls;
}

function normalizeUrl(url) {
    const urlObj = new URL(url)
    url = urlObj.hostname + urlObj.pathname
    if (url.endsWith('/')) {
        url = url.slice(0, -1)
    }
    return url;
}

module.exports = {
    normalizeUrl,
    getURLsFromHTML,
    crawlPage
}