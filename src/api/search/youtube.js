module.exports = function (app) {
  const fetch = require('node-fetch')

  app.get('/search/ytmp3', async (req, res) => {
    try {
      const { url } = req.query
      if (!url) return res.json({ status: false, message: 'Url is required' })

      const response = await fetch(`https://zenz.biz.id/downloader/ytmp3?url=${encodeURIComponent(url)}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      })

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

      const data = await response.json()
      res.json({
        status: true,
        title: data.title,
        creator: data.creator,
        duration: data.duration,
        thumbnail: data.thumbnail,
        type: data.type,
        format: data.format,
        download_url: data.download_url
      })
    } catch (e) {
      res.status(500).json({ status: false, message: e.message })
    }
  })

  app.get('/search/ytmp4', async (req, res) => {
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
        creator: data.creator,
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
