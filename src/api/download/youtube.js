module.exports = function (app) {
  const fetch = require('node-fetch')
  const cheerio = require('cheerio')
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

  async function getInfoFromCnvmp3(url) {
    const res = await fetch(`https://cnvmp3.com/convert?url=${encodeURIComponent(url)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })

    const html = await res.text()
    const $ = cheerio.load(html)

    const title = $('div.title > h4').text().trim()
    const durationText = $('div.title > p').text().trim()
    const durationMatch = durationText.match(/Duration:\s*(\d+):(\d+)/)
    const seconds = durationMatch ? parseInt(durationMatch[1]) * 60 + parseInt(durationMatch[2]) : 0

    const rawThumb = $('img.thumb').attr('src') || ''
    const thumb = rawThumb.startsWith('http') ? rawThumb : rawThumb ? 'https://cnvmp3.com' + rawThumb : null

    const audio_url = $('a[href*="/file/"]:contains("Download MP3")').attr('href')
    const video_url = $('a[href*="/file/"]:contains("Download MP4")').attr('href')

    return {
      title,
      duration: seconds,
      thumb,
      audio_url,
      video_url
    }
  }

  app.get('/download/ytmp3', async (req, res) => {
    try {
      const { url } = req.query
      if (!url) return res.json({ status: false, message: 'Url is required' })

      const data = await getInfoFromCnvmp3(url)
      const duration = formatDuration(data.duration)

      let tourl = ''
      if (data.thumb) {
        const thumbRes = await fetch(data.thumb)
        const thumbBuffer = await thumbRes.buffer()
        tourl = await uploadToCatbox(thumbBuffer)
      }

      res.json({
        status: true,
        title: data.title,
        duration,
        message: `🎵 *Judul:* ${data.title}\n⏰ *Durasi:* ${duration}\n\n*Sedang Mengirim Audio...*`,
        tourl,
        audio_url: data.audio_url,
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

      const data = await getInfoFromCnvmp3(url)
      const duration = formatDuration(data.duration)

      let tourl = ''
      if (data.thumb) {
        const thumbRes = await fetch(data.thumb)
        const thumbBuffer = await thumbRes.buffer()
        tourl = await uploadToCatbox(thumbBuffer)
      }

      res.json({
        status: true,
        title: data.title,
        duration,
        quality: 'Auto',
        message: `🎬 *Judul:* ${data.title}\n⏰ *Durasi:* ${duration}\n📽️ *Kualitas:* Auto\n\n*Sedang Mengirim Video...*`,
        tourl,
        video_url: data.video_url,
        creator: 'RijalGanzz'
      })
    } catch (e) {
      res.status(500).json({ status: false, message: e.message })
    }
  })
          }
