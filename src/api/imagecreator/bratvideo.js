const axios = require('axios')

module.exports = function app(app) {
  app.get('/imagecreator/bratvideo', async (req, res) => {
    try {
      const { text } = req.query
      if (!text) return res.status(400).json({ status: false, message: 'Parameter "text" wajib diisi' })

      const api = `https://brat.siputzx.my.id/gif?text=${encodeURIComponent(text)}`
      let response = await axios.get(api, { responseType: 'arraybuffer' })
      let type = response.headers['content-type']

      res.setHeader('Content-Type', type || 'application/octet-stream')
      res.setHeader('Content-Length', response.headers['content-length'] || response.data.length)
      res.send(Buffer.from(response.data, 'binary'))
    } catch (err) {
      res.status(500).json({ status: false, message: err.message })
    }
  })
}
