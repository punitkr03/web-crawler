const {JSDOM} = require('jsdom')

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
    getURLsFromHTML
}