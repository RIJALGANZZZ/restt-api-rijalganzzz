const cheerio = require('cheerio')
const moment = require('moment-timezone')
const fetch = require('node-fetch')

module.exports = function(app) {
  app.get('/imagecreator/stockfruit', async (req, res) => {
    try {
      const response = await fetch('https://fruityblox.com/stock')
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

      const html = await response.text()
      const $ = cheerio.load(html)
      const fruits = []

      $('.stock-table tbody tr').each((i, el) => {
        const name = $(el).find('td').eq(0).text().trim()
        const rarity = $(el).find('td').eq(1).text().trim()
        const price = $(el).find('td').eq(2).text().trim()
        const inStock = $(el).find('td').eq(3).text().trim().toLowerCase() === 'yes'
        fruits.push({ name, rarity, price, inStock })
      })

      res.json({
        status: true,
        creator: 'RijalGanzz',
        update: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
        total: fruits.length,
        fruits
      })
    } catch (e) {
      res.status(500).json({ status: false, message: e.message })
    }
  })
          }
