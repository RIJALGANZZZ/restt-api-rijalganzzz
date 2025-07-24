module.exports = function (app) {
  const fetch = require('node-fetch')

  app.get('/download/ytmp3', async (req, res) => {
    try {
      const { query } = req.query
      if (!query) return res.json({ status: false, message: 'Query is required' })

      const response = await fetch(`https://api.vreden.my.id/api/ytplaymp3?query=${encodeURIComponent(query)}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      })

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

      const json = await response.json()
      const meta = json.result.metadata
      const dl = json.result.download

      res.json({
        status: true,
        title: meta.title,
        creator: meta.author.name,
        duration: meta.timestamp,
        thumbnail: meta.thumbnail,
        type: meta.type,
        format: 'mp3',
        quality: dl.quality,
        download_url: dl.url,
        filename: dl.filename
      })
    } catch (e) {
      res.status(500).json({ status: false, message: e.message })
    }
  })

  app.get('/download/ytmp4', async (req, res) => {
    try {
      const { url } = req.query
      if (!url) return res.json({ status: false, message: 'Url is required' })

      const response = await fetch(`https://zenz.biz.id/downloader/ytmp4?url=${encodeURIComponent(url)}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      })

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

      const data = await response.json()
      res.json({
        status: true,
        title: data.title,
        creator: 'RijalGanzz',
        duration: data.duration,
        thumbnail: data.thumbnail,
        type: data.type,
        quality: data.quality,
        download_url: data.download_url
      })
    } catch (e) {
      res.status(500).json({ status: false, message: e.message })
    }
  })
        }
