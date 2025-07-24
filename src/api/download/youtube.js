module.exports = function (app) {
  const fetch = require('node-fetch')
  const FormData = require('form-data')

  function formatDuration(seconds) {
    if (!seconds || isNaN(seconds)) return 'Durasi tidak diketahui'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins} menit ${secs} detik`
  }

  function getVideoId(link) {
    const patterns = [
      /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
    ]
    for (const p of patterns) {
      const match = link.match(p)
      if (match) return match[1]
    }
    throw new Error('URL tidak valid')
  }

  async function uploadToCatbox(buffer, filename = 'thumb.jpg') {
    const form = new FormData()
    form.append('reqtype', 'fileupload')
    form.append('fileToUpload', buffer, filename)

    const res = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: form
    })

    if (!res.ok) throw new Error('Catbox upload failed')
    return await res.text()
  }

  async function convert(videoId, format = 'mp3') {
    const convertURL = `https://ytmp3.mobi/@api/json/${videoId}`
    const response = await fetch(convertURL)
    if (!response.ok) throw new Error('Gagal menghubungi ytmp3.mobi')
    const json = await response.json()
    if (!json || !json.vid) throw new Error('Video tidak ditemukan')
    return json
  }

  app.get('/download/ytmp3', async (req, res) => {
    try {
      const { url } = req.query
      if (!url) return res.json({ status: false, message: 'Url is required' })

      const videoId = getVideoId(url)
      const data = await convert(videoId, 'mp3')

      const title = data.title || 'Judul tidak tersedia'
      const duration = formatDuration(data.length_seconds)

      const thumbRes = await fetch(data.thumbnail)
      const thumbBuffer = await thumbRes.buffer()
      const tourl = await uploadToCatbox(thumbBuffer)

      res.json({
        status: true,
        title,
        duration,
        message: `🎵 *Judul:* ${title}\n⏰ *Durasi:* ${duration}\n\n*Sedang Mengirim Audio...*`,
        tourl,
        audio_url: data.link,
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

      const videoId = getVideoId(url)
      const data = await convert(videoId, 'mp4')

      const title = data.title || 'Judul tidak tersedia'
      const duration = formatDuration(data.length_seconds)

      const thumbRes = await fetch(data.thumbnail)
      const thumbBuffer = await thumbRes.buffer()
      const tourl = await uploadToCatbox(thumbBuffer)

      res.json({
        status: true,
        title,
        duration,
        quality: '480p',
        message: `🎬 *Judul:* ${title}\n⏰ *Durasi:* ${duration}\n📽️ *Kualitas:* 480p\n\n*Sedang Mengirim Video...*`,
        tourl,
        video_url: data.link,
        creator: 'RijalGanzz'
      })
    } catch (e) {
      res.status(500).json({ status: false, message: e.message })
    }
  })
    }
