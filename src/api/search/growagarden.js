module.exports = function (app) {
  const fetch = require('node-fetch')

  app.get('/search/growagarden', async (req, res) => {
    try {
      const response = await fetch(`https://gagstock.gleeze.com/grow-a-garden`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      })

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

      const json = await response.json()

      res.json({
        status: true,
        creator: 'RijalGanzz',
        updated_at: json.updated_at || json.data.updated_at,
        data: json.data
      })
    } catch (e) {
      res.status(500).json({
        status: false,
        creator: 'RijalGanzz',
        message: e.message
      })
    }
  })
    }
