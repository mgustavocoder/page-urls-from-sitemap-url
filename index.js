const fetchUrls = require('./src/fetchUrls')

module.exports = async (siteMapUrl) => {
  return fetchUrls(siteMapUrl)
}
