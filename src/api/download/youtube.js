module.exports = function (app) {
  const fetch = require('node-fetch')
  const FormData = require('form-data')
  const AbortController = require('abort-controller')

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

  async function safeFetch(url, timeoutMs = 10000) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeout)
    return res
  }

  app.get('/download/ytmp3', async (req, res) => {
    try {
      const { url } = req.query
      if (!url) return res.json({ status: false, message: 'Url is required' })

      const apiUrl = `https://api.zyy.my.id/api/downloader/youtube/playmp3?query=${encodeURIComponent(url)}`
      const response = await safeFetch(apiUrl)
      const result = await response.json()
      const data = result.result

      const duration = formatDuration(data.duration || 0)

      let tourl = ''
      if (data.thumbnail) {
        const thumbRes = await safeFetch(data.thumbnail)
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
        audio_url: data.audio
      })
    } catch (e) {
      res.status(500).json({ status: false, message: e.message })
    }
  })

  app.get('/download/ytmp4', async (req, res) => {
    try {
      const { url } = req.query
      if (!url) return res.json({ status: false, message: 'Url is required' })

      const apiUrl = `https://api.zyy.my.id/api/downloader/youtube/playmp4?query=${encodeURIComponent(url)}`
      const response = await safeFetch(apiUrl)
      const result = await response.json()
      const data = result.result

      const duration = formatDuration(data.duration || 0)

      let tourl = ''
      if (data.thumbnail) {
        const thumbRes = await safeFetch(data.thumbnail)
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
        video_url: data.video
      })
    } catch (e) {
      res.status(500).json({ status: false, message: e.message })
    }
  })
        }
