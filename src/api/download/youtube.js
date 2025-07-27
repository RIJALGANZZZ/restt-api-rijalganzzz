module.exports = function (app) {
  const fetch = require('node-fetch')

  function formatDuration(seconds) {
    if (!seconds || isNaN(seconds)) return 'Durasi tidak diketahui'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins} menit ${secs} detik`
  }

  function extractVideoID(url) {
    const match = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
    return match ? match[1] : null
  }

  app.get('/download/ytmp3', async (req, res) => {
    try {
      const { url } = req.query
      if (!url) return res.json({ status: false, message: 'Url is required' })

      const response = await fetch(`https://zenz.biz.id/downloader/ytmp3?url=${encodeURIComponent(url)}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      })

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

      const data = await response.json()
      const title = data.title || 'Judul tidak tersedia'
      const duration = formatDuration(data.duration)
      const videoId = extractVideoID(url)
      const ytImg = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : data.thumbnail

      res.json({
        status: true,
        title,
        duration,
        message: `🎵 *Judul:* ${title}\n⏰ *Durasi:* ${duration}\n\n*Sedang Mengirim Audio...*`,
        tourl: ytImg,
        audio_url: data.download_url,
        creator: 'RijalGanzz'
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
      const title = data.title || 'Judul tidak tersedia'
      const duration = formatDuration(data.duration)
      const videoId = extractVideoID(url)
      const ytImg = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : data.thumbnail

      res.json({
        status: true,
        title,
        duration,
        quality: data.quality,
        message: `🎬 *Judul:* ${title}\n⏰ *Durasi:* ${duration}\n📽️ *Kualitas:* ${data.quality}\n\n*Sedang Mengirim Video...*`,
        tourl: ytImg,
        video_url: data.download_url,
        creator: 'RijalGanzz'
      })
    } catch (e) {
      res.status(500).json({ status: false, message: e.message })
    }
  })
                                 }
