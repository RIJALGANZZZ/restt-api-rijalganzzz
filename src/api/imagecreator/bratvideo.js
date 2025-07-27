const axios = require('axios')

module.exports = function app(app) {
  app.get('/imagecreator/bratvideo', async (req, res) => {
    try {
      const { text } = req.query
      if (!text) return res.status(400).json({ status: false, message: 'Parameter "text" wajib diisi' })

      const api = `https://zenz.biz.id/maker/bratvid?text=${encodeURIComponent(text)}`
      let response = await axios.get(api, { responseType: 'arraybuffer' })
      let type = response.headers['content-type']

      if (type && type.includes('application/json')) {
        const json = JSON.parse(response.data.toString())
        if (!json.result) return res.status(500).json({ status: false, message: 'Gagal mengambil video' })
        response = await axios.get(json.result, { responseType: 'arraybuffer' })
        type = response.headers['content-type']
      }

      res.setHeader('Content-Type', type || 'application/octet-stream')
      res.setHeader('Content-Length', response.headers['content-length'] || response.data.length)
      res.send(Buffer.from(response.data, 'binary'))
    } catch (err) {
      res.status(500).json({ status: false, message: err.message })
    }
  })
}
