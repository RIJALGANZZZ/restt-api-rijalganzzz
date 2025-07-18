const fetch = require('node-fetch')

module.exports = function app(app) {
  app.get('/imagecreator/bratvideo', async (req, res) => {
    try {
      const { text } = req.query
      if (!text) return res.json({ status: false, error: 'Parameter text wajib diisi' })

      const apiRes = await fetch(`https://zenz.biz.id/maker/bratvid?text=${encodeURIComponent(text)}`)
      const json = await apiRes.json()
      if (!json.status || !json.result) {
        return res.json({ status: false, error: 'Gagal ambil video dari zenz' })
      }

      res.json({
        status: true,
        creator: 'RijalGanzz',
        result: json.result
      })
    } catch (err) {
      res.status(500).json({ status: false, error: err.message })
    }
  })
}
