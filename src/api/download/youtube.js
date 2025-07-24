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

  async function fetchJson(url) {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    if (!res.ok) throw new Error('Gagal fetch data')
    return await res.json()
  }

  function getVideoId(link) {
    try {
      const u = new URL(link)
      const id = u.searchParams.get('v')
      if (!id) throw new Error('ID video tidak valid')
      return id
    } catch {
      throw new Error('URL tidak valid')
    }
  }

  app.get('/download/ytmp3', async (req, res) => {
    try {
      const { url } = req.query
      if (!url) return res.json({ status: false, message: 'Url is required' })

      const videoId = getVideoId(url)
      const convertURL = `https://ytmp3.mobi/@api/button/mp3/${videoId}`
      const param = new URLSearchParams({ v: videoId, f: 'mp3', _: Math.random() })
      const { progressURL, downloadURL } = await fetchJson(`${convertURL}&${param.toString()}`)

      for (let i = 0; i < 20; i++) {
        const progressData = await fetchJson(progressURL)
        if (progressData.progress === 3) {
          const downloadData = await fetchJson(downloadURL)
          const title = downloadData.title || 'Judul tidak tersedia'
          const duration = formatDuration(parseInt(downloadData.length))
          const thumbRes = await fetch(downloadData.thumb)
          const thumbBuffer = await thumbRes.buffer()
          const tourl = await uploadToCatbox(thumbBuffer)

          return res.json({
            status: true,
            title,
            duration,
            message: `🎵 *Judul:* ${title}\n⏰ *Durasi:* ${duration}\n\n*Sedang Mengirim Audio...*`,
            tourl,
            audio_url: downloadData.download,
            creator: 'RijalGanzz'
          })
        }
        await new Promise(r => setTimeout(r, 1000))
      }

      throw new Error('Timeout konversi audio')
    } catch (e) {
      res.status(500).json({ status: false, message: e.message })
    }
  })

  app.get('/download/ytmp4', async (req, res) => {
    try {
      const { url } = req.query
      if (!url) return res.json({ status: false, message: 'Url is required' })

      const videoId = getVideoId(url)
      const convertURL = `https://ytmp3.mobi/@api/button/mp4/${videoId}`
      const param = new URLSearchParams({ v: videoId, f: 'mp4', _: Math.random() })
      const { progressURL, downloadURL } = await fetchJson(`${convertURL}&${param.toString()}`)

      for (let i = 0; i < 20; i++) {
        const progressData = await fetchJson(progressURL)
        if (progressData.progress === 3) {
          const downloadData = await fetchJson(downloadURL)
          const title = downloadData.title || 'Judul tidak tersedia'
          const duration = formatDuration(parseInt(downloadData.length))
          const quality = downloadData.quality || 'Tidak diketahui'
          const thumbRes = await fetch(downloadData.thumb)
          const thumbBuffer = await thumbRes.buffer()
          const tourl = await uploadToCatbox(thumbBuffer)

          return res.json({
            status: true,
            title,
            duration,
            quality,
            message: `🎬 *Judul:* ${title}\n⏰ *Durasi:* ${duration}\n📽️ *Kualitas:* ${quality}\n\n*Sedang Mengirim Video...*`,
            tourl,
            video_url: downloadData.download,
            creator: 'RijalGanzz'
          })
        }
        await new Promise(r => setTimeout(r, 1000))
      }

      throw new Error('Timeout konversi video')
    } catch (e) {
      res.status(500).json({ status: false, message: e.message })
    }
  })
                                }
