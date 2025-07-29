const axios = require('axios')
const cheerio = require('cheerio')

module.exports = function (app) {
  app.get('/search/bloxfruit', async (req, res) => {
    try {
      const { data } = await axios.get('https://fruityblox.com/stock')
      const $ = cheerio.load(data)
      const result = []

      $('.p-4.border').each((_, el) => {
        const name = $(el).find('h3.font-medium').text().trim()
        const stock = $(el).find('span.text-xs').text().trim()
        const price = $(el).find('span.text-sm').filter((_, e) => $(e).text().includes('$')).first().text().trim()
        const rValue = $(el).find('span.text-sm').filter((_, e) => $(e).text().includes('R')).first().text().trim()

        result.push(`${name}\n${stock}\n${price}\n${rValue}`)
      })

      res.json({
        status: true,
        creator: 'Rijalganzz',
        total: result.length,
        result
      })
    } catch {
      res.status(500).json({
        status: false,
        creator: 'Rijalganzz',
        error: 'Failed to fetch stock data'
      })
    }
  })
}
