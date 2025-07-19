const axios = require('axios');

module.exports = function app(app) {
  app.get('/imagecreator/bratvideo', async (req, res) => {
    try {
      const { text } = req.query
      if (!text) return res.status(400).json({ status: false, message: 'Parameter "text" wajib diisi' })

      const videoUrl = `https://zenz.biz.id/maker/bratvid?text=${encodeURIComponent(text)}`
      const response = await axios.get(videoUrl, { responseType: 'stream' })

      res.setHeader('Content-Type', 'video/mp4')
      response.data.pipe(res)
    } catch (err) {
      res.status(500).json({ status: false, message: err.message })
    }
  });
};
