const logger = require('./src/lib/logger')
const axios = require('axios')
const axiosRetry = require('axios-retry')
const xml2js = require('xml2js')
const get = require('lodash.get')

axiosRetry(axios, { retries: 3 })

async function fetchUrls (siteMapUrl) {
  const resultUrls = []
  try {
    const { data } = await axios.get(siteMapUrl)
    const parser = new xml2js.Parser()
    const siteMapXml = await parser.parseStringPromise(data)
    const sitemap = get(siteMapXml, 'sitemapindex.sitemap')
    const urlset = get(siteMapXml, 'urlset.url')

    if (sitemap) {
      let subSitemapUrls = sitemap.map(url => url.loc).flat()
      subSitemapUrls = subSitemapUrls.map(subSitemapUrl => {
        subSitemapUrl = subSitemapUrl.replace('\n', '')
        return subSitemapUrl.replace('\n', '')
      })
      const subSiteMapRecursivePromisses = subSitemapUrls.map(subSiteMapUrl => fetchUrls(subSiteMapUrl))
      resultUrls.push(await Promise.all(subSiteMapRecursivePromisses))
    }

    if (urlset) {
      const pageUrls = urlset.map(url => url.loc).flat()
      resultUrls.push(pageUrls)
    }

    return resultUrls.flat()
  } catch (err) {
    logger.error({ siteMapUrl, message: err.message }, 'Error to fetch urls for this sitemap.')
    return []
  }
}

module.exports = async siteMapUrl => {
  const urls = await fetchUrls(siteMapUrl)
  return urls.flat()
}
