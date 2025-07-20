const cheerio = require('cheerio')
const moment = require('moment-timezone')
const fetch = require('node-fetch')

module.exports = function(app) {
  app.get('/imagecreator/stockfruit', async (req, res) => {
    try {
      const response = await fetch('https://fruityblox.com/stock')
      const html = await response.text()
      const $ = cheerio.load(html)

      const stock = []

      $('.flex.flex-wrap.justify-center.gap-2.md\\:gap-4.mt-4 > a').each((i, el) => {
        const name = $(el).find('p.font-bold').text().trim()
        const price = $(el).find('p.text-sm').text().trim()
        const image = $(el).find('img').attr('src')
        const link = $(el).attr('href')
        if (name && price) {
          stock.push({
            name,
            price,
            image: image?.startsWith('http') ? image : `https://fruityblox.com${image}`,
            url: `https://fruityblox.com${link}`
          })
        }
      })

      const time = moment().tz('Asia/Jakarta').format('HH:mm:ss - DD/MM/YYYY')
      res.json({
        status: true,
        creator: 'RijalGanzz',
        update: time,
        total: stock.length,
        stock
      })
    } catch (e) {
      res.status(500).json({ status: false, message: 'Gagal memuat stock', error: e.message })
    }
  })
}
