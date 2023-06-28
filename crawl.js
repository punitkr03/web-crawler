const {JSDOM} = require('jsdom')

async function crawlPage(currentURL, htmlBody) {
    console.log(`Crawling ${currentURL}`)
    try {
        const res = await fetch(currentURL)
        if(res.status > 399) {
            console.log(`Error in fetch with status code: ${res.status}, on page: ${currentURL}`)
            return
        }
        const contentType = res.headers.get('content-type')
        if(!contentType.includes("text/html")) {
            console.log(`Non html response, content-type: ${contentType}, on page: ${currentURL}`)
            return
        }

        console.log(await res.text())
    } catch(err) {
        console.log(`Error in fetch: ${err.message}, on page: ${currentURL}`)
    }
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