const fetch = require('node-fetch')

module.exports = function app(app) {
  app.get('/imagecreator/bratvideo', async (req, res) => {
    try {
      const { text } = req.query
      if (!text) return res.json({ status: false, error: 'Parameter text wajib diisi' })

      const url = `https://zenz.biz.id/maker/bratvid?text=${encodeURIComponent(text)}`
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status} - ${await response.text()}`)

      const buffer = await response.buffer()
      res.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Content-Length': buffer.length
      })
      res.end(buffer)
    } catch (error) {
      res.status(500).send(`Error: ${error.message}`)
    }
  })
}
