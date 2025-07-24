module.exports = function (app) {
  const fetch = require('node-fetch')
  const FormData = require('form-data')

  function formatDuration(seconds) {
    if (!seconds || isNaN(seconds)) return 'Durasi tidak diketahui'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins} menit ${secs} detik`
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

  app.get('/download/ytmp3', async (req, res) => {
    try {
      const { url } = req.query
      if (!url) return res.json({ status: false, message: 'Url is required' })

      const response = await fetch(`https://api.akuari.my.id/downloader/youtube2?link=${encodeURIComponent(url)}`)
      const result = await response.json()
      const data = result.mp3 || {}

      const duration = formatDuration(data.duration || 0)

      let tourl = ''
      if (data.thumb) {
        const thumbRes = await fetch(data.thumb)
        const thumbBuffer = await thumbRes.buffer()
        tourl = await uploadToCatbox(thumbBuffer)
      }

      res.json({
        status: true,
        creator: 'RijalGanzz',
        title: data.title || 'Tidak diketahui',
        duration,
        message: `🎵 *Judul:* ${data.title}\n⏰ *Durasi:* ${duration}\n\n*Sedang Mengirim Audio...*`,
        tourl,
        audio_url: data.link
      })
    } catch (e) {
      res.status(500).json({ status: false, message: e.message })
    }
  })

  app.get('/download/ytmp4', async (req, res) => {
    try {
      const { url } = req.query
      if (!url) return res.json({ status: false, message: 'Url is required' })

      const response = await fetch(`https://api.akuari.my.id/downloader/youtube2?link=${encodeURIComponent(url)}`)
      const result = await response.json()
      const data = result.mp4?.[0] || {}

      const duration = formatDuration(result.mp4?.[0]?.duration || 0)

      let tourl = ''
      if (data.thumb) {
        const thumbRes = await fetch(data.thumb)
        const thumbBuffer = await thumbRes.buffer()
        tourl = await uploadToCatbox(thumbBuffer)
      }

      res.json({
        status: true,
        creator: 'RijalGanzz',
        title: data.title || 'Tidak diketahui',
        duration,
        quality: data.quality || 'Auto',
        message: `🎬 *Judul:* ${data.title}\n⏰ *Durasi:* ${duration}\n📽️ *Kualitas:* ${data.quality}\n\n*Sedang Mengirim Video...*`,
        tourl,
        video_url: data.link
      })
    } catch (e) {
      res.status(500).json({ status: false, message: e.message })
    }
  })
                                    }
