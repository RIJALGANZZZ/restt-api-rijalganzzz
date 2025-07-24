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

      const endpoint = `https://api.lolhuman.xyz/api/ytmusic?apikey=free&url=${encodeURIComponent(url)}`
      const response = await fetch(endpoint)

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

      const { result } = await response.json()
      const duration = formatDuration(result.duration || 0)

      let tourl = ''
      if (result.thumbnail) {
        const thumbRes = await fetch(result.thumbnail)
        const thumbBuffer = await thumbRes.buffer()
        tourl = await uploadToCatbox(thumbBuffer)
      }

      res.json({
        status: true,
        creator: 'RijalGanzz',
        title: result.title || 'Tidak diketahui',
        duration,
        message: `🎵 *Judul:* ${result.title}\n⏰ *Durasi:* ${duration}\n\n*Sedang Mengirim Audio...*`,
        tourl,
        audio_url: result.link
      })
    } catch (e) {
      res.status(500).json({ status: false, message: e.message })
    }
  })

  app.get('/download/ytmp4', async (req, res) => {
    try {
      const { url } = req.query
      if (!url) return res.json({ status: false, message: 'Url is required' })

      const endpoint = `https://api.lolhuman.xyz/api/ytvideo?apikey=free&url=${encodeURIComponent(url)}`
      const response = await fetch(endpoint)

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

      const { result } = await response.json()
      const duration = formatDuration(result.duration || 0)

      let tourl = ''
      if (result.thumbnail) {
        const thumbRes = await fetch(result.thumbnail)
        const thumbBuffer = await thumbRes.buffer()
        tourl = await uploadToCatbox(thumbBuffer)
      }

      res.json({
        status: true,
        creator: 'RijalGanzz',
        title: result.title || 'Tidak diketahui',
        duration,
        quality: result.quality || 'Auto',
        message: `🎬 *Judul:* ${result.title}\n⏰ *Durasi:* ${duration}\n📽️ *Kualitas:* ${result.quality}\n\n*Sedang Mengirim Video...*`,
        tourl,
        video_url: result.link
      })
    } catch (e) {
      res.status(500).json({ status: false, message: e.message })
    }
  })
    }
